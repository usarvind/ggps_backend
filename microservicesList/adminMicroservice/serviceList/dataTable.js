'use strict';
var ObjectId = require('mongodb').ObjectID;
var mongoose = require('mongoose'),
    async = require('async'),
    contactModel = require("../../../model/contactModel"),
    vehicleModel = require("../../../model/vehicleModel"),

    /**
     * Method getSearchableFields
     * Returns an array of fieldNames based on DataTable params object
     * All columns in params.columns that have .searchable == true field will have the .data param returned in an String
     * array. The .data property is used because in angular frontend DTColumnBuilder.newColumn('str') puts 'str' in the
     * data field, instead of the name field.
     * @param params
     * @returns {Array}
     */
    getSearchableFields = function (params) {
        return params.columns.filter(function (column) {
            return JSON.parse(column.searchable);
        }).map(function (column) {
            return column.data;
        });
    },

    /**
     * Method isNaNorUndefined
     * Checks if any of the passed params is NaN or undefined.
     * Used to check DataTable's properties draw, start and length
     * @returns {boolean}
     */
    isNaNorUndefined = function () {
        var args = Array.prototype.slice.call(arguments);
        return args.some(function (arg) {
            return isNaN(arg) || (!arg && arg !== 0);
        });
    },

    /**
     * Methdd buildFindParameters
     * Builds a MongoDB find expression based on DataTables param object
     * - If no search text if provided (in params.search) an empty object is returned, meaning all data in DB will
     * be returned.
     * - If only one column is searchable (that means, only one params.columns[i].searchable equals true) a normal one
     * field regex MongoDB query is returned, that is {`fieldName`: new Regex(params.search, 'i'}
     * - If multiple columns are searchable, an $or MongoDB is returned, that is:
     * ```
     * {
     *     $or: [
     *         {`searchableField1`: new Regex(params.search, 'i')},
     *         {`searchableField2`: new Regex(params.search, 'i')}
     *     ]
     * }
     * ```
     * and so on.<br>
     * All search are by regex so the field param.searchregex is ignored.
     * @param params DataTable params object
     * @returns {*}
     */
    /**
     * Method buildSortParameters
     * Based on DataTable parameters, this method returns a MongoDB ordering parameter for the appropriate field
     * The params object must contain the following properties:
     * order: Array containing a single object
     * order[0].column: A string parseable to an Integer, that references the column index of the reference field
     * order[0].dir: A string that can be either 'asc' for ascending order or 'desc' for descending order
     * columns: Array of column's description object
     * columns[i].data: The name of the field in MongoDB. If the index i is equal to order[0].column, and
     * the column is orderable, then this will be the returned search param
     * columns[i].orderable: A string (either 'true' or 'false') that denotes if the given column is orderable
     * @param params
     * @returns {*}
     */
    buildSortParameters = function (params) {
        if (!params || !Array.isArray(params.order) || params.order.length === 0) {
            return null;
        } else {
            var data = {};
            for (let index = 0; index < params.order.length; index++) {
                var sortColumn = Number(params.order[index].column),
                    sortOrder = params.order[index].dir,
                    sortField;

                if ((isNaNorUndefined(sortColumn) || !Array.isArray(params.columns) || sortColumn >= params.columns.length) || (params.columns[sortColumn].orderable === 'false')) {
                } else {
                    sortField = params.columns[sortColumn].data;
                }
                if (!sortField) {
                } else if (sortOrder === 'asc') {
                    data[sortField] = 1;
                } else if (sortOrder === 'desc') {
                    data[sortField] = -1;
                };
            }
            return data;
        }
    },

    buildProjectParameters = function (params) {
        if (!params || !params.columns || !Array.isArray(params.columns)) {
            return null;
            ;
        }
        return params
            .columns
            .map(col => col.data)
            .reduce((selectParams, field) => {
                if (field && field !== "") {
                    selectParams[field] = {
                        $ifNull: ["$" + field, null]
                    }
                }
                return selectParams;
            }, {});
    },

    buildConditions = function (columns, params) {
        var data = {
            local: {},
            foreign: {}
        };
        if (!columns) {
            return {};
        } else {
            columns.forEach(function (item) {
                if (item.search !== '') {
                    let keyName = item.data;
                    if (keyName == "vehicleRef" || keyName == "mobileNumber" || keyName == "fullName" || keyName == "emailID" || keyName == "officeAddress" || keyName == "pinCode" || keyName == "city" || keyName == "state") {
                        Object.assign(data.foreign, {
                            [keyName]: item.search
                        });
                    }

                    else {
                        // console.log("assign", keyName)
                        // if (keyName == "docket") {

                        //     Object.assign(data.local, { [keyName]: { "$in": [[], null] } })
                        // }
                        // else {
                        Array.isArray(item.search) == true ? Object.assign(data.local, { [keyName]: { $in: item.search } })
                            : Object.assign(data.local, { [keyName]: item.search });
                    }
                    // }
                }

            });
            // console.log("datadata:", (params.isDispatch))
            if (params.isDispatch == true) {
                // Object.assign(data.local, {
                //     "docket": { "$in":  [[], null] } 
                // })
                Object.assign(data.local, {
                    '$and': [{
                        '$or': [
                            { docket: { "$in": [[], null] } },
                            {
                                'docket.docketFrom': {
                                    $nin: [ObjectId("5f756c814812017b12258eb6")]
                                }
                            }
                        ]
                    }]
                })
            }
            console.log("datadata:", data)
            return data;
        }
    },

    buildGlobalMatchFields = function (Model, params) {
        if (!params || !params.columns || !params.search || params.search == '') {
            return null;
        };

        var searchText = params.search, searchRegex = null, isValid = true, findParameters = {}, searchOrArray = [];
        //below refex if for contains search It cabe relaced with new RegExp("^" + searchText, "i") for starts with search
        try {
            new RegExp(".*" + searchText + ".*", "i");
        } catch (e) {
            isValid = false;
        }
        if (isValid) searchRegex = {
            $regex: new RegExp(".*" + searchText + ".*", "i")
        };
        var searchableFieldsDefault = getSearchableFields(params);
        var searchableFields = [];
        if (Array.isArray(searchableFieldsDefault)) {
            searchableFieldsDefault.forEach((field) => {
                if ((Model.schema.paths[field] && Model.schema.paths[field].instance === "String") || (vehicleModel.schema.paths[field] && vehicleModel.schema.paths[field].instance === "String") || (contactModel.schema.paths[field] && contactModel.schema.paths[field].instance === "String")) {
                    searchableFields.push(field);
                };
            });
        }
        searchableFields.forEach(function (field) {
            if (searchRegex) {
                searchOrArray.push({ [field]: searchRegex });
            };
        });

        if (searchOrArray.length !== 0) findParameters.$or = searchOrArray;
        return findParameters;
    };
/**
 * Run wrapper function
 * Serves only to the Model parameter in the wrapped run function's scope
 * @param {Object} Model Mongoose Model Object, target of the search
 * @returns {Function} the actual run function with Model in its scope
 */
var datatablesQuery = {
    run: function (Model, params) {
        /**
         * Method Run
         * The actual run function
         * Performs the query on the passed Model object, using the DataTable params argument
         * @param {Object} params DataTable params object
         */
        //return function (params) {

        var draw = Number(params.draw),
            start = Number(params.start),
            length = Number(params.length),
            sortParameters = buildSortParameters(params),
            conditions = buildConditions(params.columns, params),
            globalMatchFields = buildGlobalMatchFields(Model, params),
            projectParameters = buildProjectParameters(params),
            recordsTotal,
            recordsFiltered,
            findParameter = { $and: [] },
            recordsFilteredPipe = [],
            pipeline = [];

        return new Promise(function (fullfill, reject) {
            async.series([
                function buildPipeline(cb) {
                    if (Object.values(conditions.local).length !== 0) {
                        pipeline.push(
                            {
                                $match: conditions.local
                            }
                        )
                    };
                    console.log(pipeline)
                    if (globalMatchFields && globalMatchFields.$or.length !== 0) {
                        findParameter.$and.push({ $or: globalMatchFields.$or });
                    };
                    if (Object.values(conditions.foreign).length !== 0) {
                        findParameter.$and.push(conditions.foreign);
                    };

                    pipeline.push({
                        $lookup: {
                            "from": "users",
                            "let": {
                                "contatcId": "$contactId"
                            },
                            "pipeline": [{
                                "$match": {
                                    "$expr": {
                                        "$eq": ["$contactId", "$$contatcId"]
                                    }
                                }
                            }],
                            "as": "contactRef"
                        },
                    }, {
                        $replaceRoot: {
                            newRoot: {
                                $mergeObjects: [{ $arrayElemAt: ["$contactRef", 0] }, "$$ROOT"]
                            }

                        }
                    });
                    if (Object.values(findParameter.$and).length !== 0) {
                        pipeline.push(
                            {
                                $match: findParameter
                            }
                        )
                    };
                    cb();
                },

                function fetchRecordsTotal(cb) {
                    Model.countDocuments({}, function (err, count) {
                        if (err) {
                            return cb(err);
                        } else {
                            recordsTotal = count;
                            cb();
                        }
                    });
                },
                function fetchRecordsFiltered(cb) {
                    if (Object.values(findParameter.$and).length !== 0) {
                        let pipeline_2 = [...pipeline];
                        pipeline_2.push({
                            $count: "count"
                        })
                        Model.aggregate(pipeline_2).exec(function (err, count) {
                            if (err) {
                                return cb(err);
                            } else {
                                recordsFiltered = count.length == 0 ? 0 : count[0].count;
                                cb();
                            }
                        });
                    } else {
                        //console.log("jjjjjjjjjj", conditions.local)
                        Model.countDocuments(conditions.local, function (err, count) {
                            if (err) {
                                return cb(err);
                            };
                            recordsFiltered = count;
                            cb();
                        });
                    }
                },
                function runQuery(cb) {
                    if (recordsFiltered == 0) {
                        cb(null, {
                            draw: draw,
                            recordsTotal: recordsTotal,
                            recordsFiltered: recordsFiltered,
                            data: []
                        });
                    } else {
                        console.log(projectParameters)
                        pipeline.push({
                            $project: projectParameters
                        }, {
                            $sort: sortParameters
                        }, {
                            $skip: start
                        }, {
                            $limit: length
                        })
                        Model.aggregate(pipeline).exec(function (err, results) {
                            if (err) {
                                return cb(err);
                            } else
                                cb(null, {
                                    draw: draw,
                                    recordsTotal: recordsTotal,
                                    recordsFiltered: recordsFiltered,
                                    data: results
                                });
                        });
                    }
                }
            ], function resolve(err, results) {
                if (err) {
                    reject({
                        error: err
                    });
                } else {
                    var answer = results[results.length - 1];
                    fullfill(answer);
                }
            });
        });
    }
}


module.exports = datatablesQuery;