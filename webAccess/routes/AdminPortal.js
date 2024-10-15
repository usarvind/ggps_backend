const { check, validationResult } = require('express-validator/check');
module.exports = function (app, controller) {
    console.log(controller)
    var middleware = require('../middlewares/index')();
    var adminValidator = require('../../microservicesList/adminMicroservice/apiValidator/validation')


    app.get('/admin', middleware.admin.isLogin, controller.login.signin);
    app.get('/admin/logout',middleware.admin.login, controller.login.adminLogout);
    app.get('/admin/profile',middleware.admin.login, controller.login.adminProfile);
    app.post('/admin/profile-password-update',middleware.admin.login,adminValidator.checkAdminProfilePassChange, controller.login.adminPasswordUpdate);

    app.get('/admin/forgot', middleware.admin.isLogin, controller.login.forget);
    app.post('/admin/loginSubmit', middleware.admin.isLogin, controller.login.loginSubmit);
    app.get('/admin/dashboard', middleware.admin.login,controller.dashboard.viewDashboard);
   
  /*------------ students routing----------- **/
  app.get('/admin/students',middleware.admin.login,controller.students.listStudents);  
  app.get('/admin/student/viewDetails/:id',middleware.admin.login,controller.students.viewStudents);
  app.get('/admin/student/add',middleware.admin.login,controller.students.add);
  app.get('/admin/student/edit/:id',middleware.admin.login,controller.students.edit);
  app.get('/admin/student/delete/:id',middleware.admin.login,controller.students.delete);
  app.get('/admin/student/deactive/:id',middleware.admin.login,controller.students.deactive_student);
  

  app.post('/admin/studentMaster/addSubmit',middleware.admin.login,controller.students.addSubmit);
  app.post('/admin/studentMaster/updateMasterRecord',middleware.admin.login,adminValidator.checkStudentMasterUpdateFields,controller.students.updateMasterRecord);

  app.post('/admin/studentMaster/getAllList',middleware.admin.login,controller.students.getAllStudentMasterList);
  app.post('/admin/showModal',controller.dynamicModal.showModal);

  /*------------ students routing-----------*/

/*------------ students academic routing----------- **/
  app.get('/admin/studentsAcademic',middleware.admin.login,controller.studentsAcademic.listStudents);  
  app.get('/admin/studentAcademic/viewDetails/:id',middleware.admin.login,controller.studentsAcademic.viewStudents);
  app.get('/admin/studentAcademic/printFeesReceipt/:id/:spaceficStudent/:academicId',middleware.admin.login,controller.studentsAcademic.printFeesReceipt);

  
  app.post('/admin/studentAcademicMaster/addSubmit',middleware.admin.login,adminValidator.checkStudentAcademicMasterFields,controller.studentsAcademic.addSubmit);
  app.post('/admin/studentAcademicMaster/updateSubmit',middleware.admin.login,adminValidator.checkStudentAcademicMasterUpdateFields,controller.studentsAcademic.updateSubmit);
  app.post('/admin/studentAcademicMaster/studentPaidFees',middleware.admin.login,controller.studentsAcademic.studentPaidFees);
  app.post('/admin/studentAcademicMaster/studentMarkUpload',middleware.admin.login,controller.studentsAcademic.studentMarkUpload);


  app.post('/admin/studentAcademicMaster/getAllList',middleware.admin.login,controller.studentsAcademic.getAllStudentMasterList);
  app.post('/admin/subjects/classWiseSubject',controller.subjects.classWiseSubjectList);
  
  

  app.get('/admin/studentsAcademic/paidFeesList/:id',middleware.admin.login,controller.studentsAcademic.studentPaidFeesList);

  app.get('/admin/studentAcademic/icardGenerate/:id',middleware.admin.login,controller.studentsAcademic.icardGenerate);

  app.get('/admin/studentsAcademic/generateExamCard/:year/:sclass',middleware.admin.login,controller.studentsAcademic.generateExamCard);

  app.get('/admin/studentsAcademic/generateStudentResults/:year/:sclass/:action',middleware.admin.login,controller.studentsAcademic.generateStudentResults);


  app.get('/admin/studentAcademic/generateResult/:id/:action',middleware.admin.login,controller.studentsAcademic.generateResult);
  
  app.get('/admin/studentAcademic/generateStudentPendingFeesList/:year/:sclass/',middleware.admin.login,controller.studentsAcademic.generateStudentPendingFeesList);

  
  
  
  

/*------------ students academic routing-----------*/


/*------------START :  students fees transaction ----------- **/
app.get('/admin/feesTransaction/lists',middleware.admin.login,controller.studentsFeesTransaction.studentsFeesTransactionList);  
app.post('/admin/feesTransaction/getAllList',middleware.admin.login,controller.studentsFeesTransaction.getStudentsFeesTransactionList);  

/**---------------------END : student fees transaction --------------------------- */



/**------------------------- Subject master ------------------ */

app.get('/admin/subjects',middleware.admin.login,controller.subjects.listSubjects);  
app.get('/admin/subject/add',middleware.admin.login,controller.subjects.add);
app.get('/admin/subject/edit/:id',middleware.admin.login,controller.subjects.edit);
app.get('/admin/subject/delete/:id',middleware.admin.login,controller.subjects.delete);

app.post('/admin/subjects/getAllList',middleware.admin.login,controller.subjects.getAllSubjectsList);
app.post('/admin/subject/addSubmit',middleware.admin.login,adminValidator.checkSubjectAddFields,controller.subjects.addSubmit);
app.post('/admin/subject/updateMasterRecord',middleware.admin.login,adminValidator.checkSubjectUpdateFields,controller.subjects.updateMasterRecord);


/**-------------------END: Subject Master--------------------- */

}



