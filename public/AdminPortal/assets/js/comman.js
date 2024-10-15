function isNumeric(value) {
   return /^-?\d+$/.test(value);
}

function gradeCalculate(totalMark=0,markObtain=0){
   totalMark=((totalMark)?totalMark:0);
   markObtain=((markObtain)?markObtain:0);

   let per=((markObtain*100)/totalMark);
   let grade="";
   if(per<=39){
      grade='F';
   }else if(per>=40 && per<=44){
      grade='C';
   }else if(per>=45 && per<=49){
      grade='C+';
   }else if(per>=50 && per<=54){
      grade='B';
   }else if(per>=55 && per<=59){
      grade='B+';
   }else if(per>=60 && per<=69){
      grade='A';
   }else if(per>=70 && per<=100){
      grade='A+';
   }else{
      grade='';
   }
   console.log("----------totalMark -------- : "+totalMark+" :markObtain :"+markObtain+" grade :"+grade +" percentage : "+per)
   return grade;

}

function callDynamicModal(type,dd={}){
    console.log("dynamic modal called ",dd)

    var $modal = $('#ajax-modal');
    $modal.load(window.origin+'/admin/showModal',{'modalType': type,'data':JSON.stringify(dd)}, 
    function(){ 

      $modal.modal('show');
      $(function() {
        window.fs_test = $('.test').fSelect();
     });
     
    });
}


$(document).on('click','#closeModal', function(){
  console.log(" close data ================================= ")
    $('#ajax-modal').modal('hide');
});

//-------------------Transport month selection ------------------

$(document).on('change','#transportMonthSelection', function(){
   
   var existValue = document.getElementsByName('academic_months_value[]');
   let objectVal={} 
   $(existValue).each(function(index, item){
    let attr_month_index_value=item.getAttribute("month_index_value");
    let input_value= item.value;
    objectVal[attr_month_index_value]=input_value;
   });

   let vals =$(this).val();
   console.log(" vals vals : ",vals)

   $('#transaportMonthsInput').empty();
   let htm=``;
   for (let dd of vals) {
    htm=htm+` <div class="col-sm-3">
    <div class="form-group">
        <label>${dd.split('``')[1]}</label>
        <input type="hidden" name="month_index_value[]" value="${dd.split('``')[0]}">
        <input type="number" placeholder="Amo..." required month_index_value="${dd.split('``')[0]}" value="${((objectVal[dd.split('``')[0]])?objectVal[dd.split('``')[0]]:'')}" required name="academic_months_value[]" class="form-control">
    </div>
  </div>`;
  }
  $('#transaportMonthsInput').append(htm);
  
   //console.log("+++++++++++++++++ : ",existValue)
})





//--------------------------------------------------------------
//------------------Adding dynamic input for subject mark-----
$(document).on('click','#addButtonSubjectList', function(){
   let stdClass= $(this).attr("studentclass");
    $.ajax({
              url: window.origin+"/admin/subjects/classWiseSubject", 
              type: 'POST',
              dataType: "json",
              data: {stdClass: stdClass}, 
              success: function(resData)
              {
                 let htm=`<div class="row row-extra">`;
                 if(resData.status){
                     if(resData.data.length>0){
                          let subhtm=`<option value="">Select subject</option>`;
                           for(let ra of resData.data){
                              console.log("=================",ra)
                              subhtm=subhtm+`
                                    <option value="${ra.subjectKey+'``'+ra.subjectName+'``'+ra.subjectSequence+'``'+ra.subjectJustForGrade}" keygradeval="${ra.subjectJustForGrade}">${ra.subjectName}</option>
                              `;
                           }

                           let ycbc = (($('#yealycheckboxcheck').prop('checked'))?'':'readonly');

                           let ycinputrequired = (($('#yealycheckboxcheck').prop('checked'))?'required':'');
                           let invalset=(($('#yealycheckboxcheck').prop('checked'))?'0':'');

                       
                           htm=htm+`
                           <div class="col-12 col-sm-2">
                              <div class="form-group">
                                 <select name="subjectName" class="form-control subject-select-dropdown" required>
                                    ${subhtm}
                                 </select>
                              </div>
                           </div>

                           <div class="col-12 col-sm-9 subjectWiseData">
                              <div class="row row-extra">
                                 <div class="col-6">
                                    <div class="row row-extra">
                                       <div class="col-12 text-center col-sm-3">
                                          <input type="text" justForGrade="false" required="" placeholder="" name="hymmdata"  examAction="1st" notation="mm" comkey="hyt_1" id="mm_hyt_1" value="" class="markInput form-control">
                                       </div>
                                       <div class="col-12 text-center col-sm-3">
                                             <input type="text" justForGrade="false" required="" placeholder="" name="hymodata" examAction="1st" notation="mo" comkey="hyt_1" id="mo_hyt_1"  value="" class="markInput form-control">
                                       </div>
                                       <div class="col-12 text-center col-sm-3">
                                          <input type="text" justForGrade="false" required="" placeholder="" name="hymo1data" examAction="1st" notation="mo" comkey="hyt_2" id="mo_hyt_2"  value="" class="markInput form-control">
                                       </div>
                                       <div class="col-12 text-center col-sm-3">
                                             <input type="text" justForGrade="false" required  readonly placeholder=""  value="" name="hygddata" examAction="1st" notation="gd" comkey="hyt_1"  value="" id="gd_hyt_1" class="markInput form-control">
                                       </div>
                                    </div>
                                 </div>
                                 <div class="col-6">
                                    <div class="row row-extra">
                                       <div class="col-12 text-center col-sm-3">
                                          <input type="text" justForGrade="false"  ${ycbc +" "+ycinputrequired}   placeholder="" name="ymmdata" examAction="2st" notation="mm" comkey="fhyt_1" id="mm_fhyt_1" value="" class="markInput yearlyMarkInput form-control">
                                       </div>
                                       <div class="col-12 text-center col-sm-3">
                                             <input type="text" justForGrade="false"  ${ycbc +" "+ycinputrequired}  placeholder="" name="ymodata" examAction="2st" notation="mo" comkey="fhyt_1" value="" id="mo_fhyt_1" class="markInput yearlyMarkInput form-control">
                                       </div>
                                       <div class="col-12 text-center col-sm-3">
                                          <input type="text" justForGrade="false"  ${ycbc +" "+ycinputrequired}  placeholder="" name="ymo1data" examAction="2st" notation="mo" comkey="fhyt_2" value="" id="mo_fhyt_2" class="markInput yearlyMarkInput form-control">
                                       </div>
                                       <div class="col-12 text-center col-sm-3">
                                             <input type="text" justForGrade="false" readonly ${ycinputrequired}   placeholder="" name="ygddata" examAction="2st" notation="gd" comkey="fhyt_1"  value="" id="gd_fhyt_1" class="markInput form-control yearlyMarkInput ">
                                       </div>
                                    </div>

                                  
                                 </div>
                              </div>
                           </div>
                          
                           <div class="col-12 col-sm-1">
                                 <a href="javascript:void(0)" id="minusButtonSubjectList" class="btn btn-danger btn-sm"><i class="fas fa-minus"></i></a>
                           </div>
                        `;

                     }else{
                        $('#dynamicInputForSubjectMark').remove();
                        htm=`<div class="col-12 text-center" style="color:red;">Please add subject list in subject master`; 
                     }
                 }else{
                  htm=htm+`${resData.message}`;
                 }

                 htm=htm+`</div>`;
                 $('#dynamicInputForSubjectMark').append(htm);
              }
      });
})

$(document).on('click','#minusButtonSubjectList', function(){
   $(this).parent().parent().remove();
});

$(document).on('click','#yealycheckboxcheck', function(){
    let yearChk =(($(this).prop('checked'))?true:false);

   $('.yearlyMarkInput').each(function(ind,ele){
     
      let forGrade=($(ele).attr("justforgrade"));
      let notaval=$(ele).attr("notation");
      if(notaval !='gd'){
         $(ele).attr("readonly",((yearChk==true)?((forGrade=="true")?true:false):true));
         $(ele).attr("required",((yearChk==true)?((forGrade=="true")?true:true):false));
         $(ele).val(((yearChk==true)?((forGrade=="true")?'NA':''):''));
      }else{
         $(ele).attr("readonly",((yearChk==true)?((forGrade=="true")?false:true):true));
         $(ele).attr("required",((yearChk==true)?((forGrade=="true")?true:true):false));
         $(ele).val(((yearChk==true)?((forGrade=="true")?'':''):''));
      }

});

});




$(document).on('change','.subject-select-dropdown', function(){
  let seldval=$(this).val();
  let cnt=0;
  $('select[name="subjectName"]').find(":selected").each((index, ele)=>{
   //console.log("------------- : "+$(ele).val())
   if($(ele).val() && $(ele).val()==seldval){
      ++cnt;
   }
  });
  if(cnt>1){
      $(this).val("");
      $(this).parent().parent().parent().find('.markInput ').each(function(ind,ele){
         $(ele).attr("justforgrade","");
     });
  }else{
     let selectedOpKeyVal =$(this).find(":selected").attr("keygradeval");
     let yearlyChk=(($('#yealycheckboxcheck').prop('checked'))?true:false);

     console.log("----------------- : "+yearlyChk)

     $(this).parent().parent().parent().find('.markInput').each(function(ind,ele){
         console.log(ele)
         $(ele).attr("justforgrade",selectedOpKeyVal);
     });

     console.log("----------------------",selectedOpKeyVal+" yearlyChk : "+yearlyChk)
     if(selectedOpKeyVal=="true"){

         $(this).parent().parent().parent().find('.markInput').each(function(ind,ele){
                  let notationkey= $(ele).attr('notation');
                  let examAction=$(ele).attr("examaction");
                  if(notationkey !='gd'){
                     $(ele).val(((yearlyChk==true)?'NA':((examAction=='1st')?'NA':'')));
                     $(ele).attr("readonly",true);
                     $(ele).attr("required",((examAction=='1st')?'true':((yearlyChk==true)?true:false)));

                  }else{
                        $(ele).val(((yearlyChk==true)?'':((examAction=='1st')?'':'')));
                        $(ele).attr("readonly",((examAction=='1st')?false:((yearlyChk==true)?false:true)));
                        $(ele).attr("required",((yearlyChk==true)?true:(examAction=='1st'?true:false)));
                     
                  }
         });

     
     }else{

         $(this).parent().parent().parent().find('.markInput').each(function(ind,ele){
            let notationkey= $(ele).attr('notation');
            let examAction=$(ele).attr("examaction");
            if(notationkey !='gd'){
               $(ele).val(((yearlyChk==true)?'':((examAction=='1st')?'':'')));
               $(ele).attr("readonly",((yearlyChk==true)?false:((examAction=='1st')?false:true)));
            }else{
               
               $(ele).val(((yearlyChk==true)?'':((examAction=='1st')?'':'')));
               $(ele).attr("readonly",((examAction=='1st')?true:((yearlyChk==true)?true:true)));
              
            }
         });

     
     }
  }
});



$(document).on('keyup','.markInput', function(){
   let seldval=$(this).val();
   let cidval=$(this).attr("id");
   let notationVal=$(this).attr("notation");
   
   let examAction =$(this).attr("examaction");
   if(notationVal !='gd'){
      if(examAction=='1st'){
            let mminputData = $(this).parent().parent().find("#mm_hyt_1").val();
            let moinputData=$(this).parent().parent().find("#mo_hyt_1").val();
            let mo2inputData=$(this).parent().parent().find("#mo_hyt_2").val();
            let gdinputData=$(this).parent().parent().find("#gd_hyt_1").val();
            if(mminputData && (isNumeric(mminputData) && mminputData>0 ) ){
               let validAnyOneInput=false;
               if(moinputData && isNumeric(moinputData)){
                  validAnyOneInput=true;
               }else if(mo2inputData && isNumeric(mo2inputData)){
                  validAnyOneInput=true;
               }
               let input1 = ((moinputData && isNumeric(moinputData))?1*moinputData:0);
               let input2 = ((mo2inputData && isNumeric(mo2inputData))?1*mo2inputData:0);

               if(validAnyOneInput){
                  let totalmobtain = input1+input2;
                  $(this).parent().parent().find("#gd_hyt_1").val(gradeCalculate(mminputData,totalmobtain));
               }
                 
            }else{
               $(this).parent().parent().find("#gd_hyt_1").val('');
            }

      }else{
         let fmminputData = $(this).parent().parent().find("#mm_fhyt_1").val();
         let fmoinputData=$(this).parent().parent().find("#mo_fhyt_1").val();
         let fmo2inputData=$(this).parent().parent().find("#mo_fhyt_2").val();

         if(fmminputData && (isNumeric(fmminputData) && fmminputData>0 ) ){
            let validAnyOneInput=false;
            if(fmoinputData && isNumeric(fmoinputData)){
               validAnyOneInput=true;
            }else if(fmo2inputData && isNumeric(fmo2inputData)){
               validAnyOneInput=true;
            }
            let input1 = ((fmoinputData && isNumeric(fmoinputData))?1*fmoinputData:0);
            let input2 = ((fmo2inputData && isNumeric(fmo2inputData))?1*fmo2inputData:0);

            if(validAnyOneInput){
               let totalmobtain = input1+input2;
               $(this).parent().parent().find("#gd_fhyt_1").val(gradeCalculate(fmminputData,totalmobtain));
            }
              
         }else{
            $(this).parent().parent().find("#gd_fhyt_1").val('');
         }

      }
   }

   // let mminputData = $(this).parent().parent().find("#mm_"+comKeyValue).val();
   // let moinputData=$(this).parent().parent().find("#mo_"+comKeyValue).val();
   // $(this).parent().parent().find("#gd_"+comKeyValue).val("")
  
   // if(notationVal=='mm'){
   //       $(this).parent().parent().find("#mxm_tot_y").val("0");

   //       if(seldval){
   //          if((isNumeric(seldval))){
   //                if(moinputData){
   //                   $(this).parent().parent().find("#gd_"+comKeyValue).val(gradeCalculate(mminputData,moinputData))
   //                }
   //          }else{
   //             $(this).parent().parent().find("#gd_"+comKeyValue).val("NA")
   //          }
   //       }
   //   let mmval1=$(this).parent().parent().find("#mm_"+(comKeyValue.split("_")[0])+"_1").val()
   //   let mmval2=$(this).parent().parent().find("#mm_"+(comKeyValue.split("_")[0])+"_2").val();
   //   let maxtotVal=0;
   //   if(mmval1 && isNumeric(mmval1)){
   //    maxtotVal=maxtotVal+(1*mmval1);
   //   }
   //   if(mmval2 && isNumeric(mmval2)){
   //     maxtotVal=maxtotVal+(1*mmval2);
   //   }
   //   $(this).parent().parent().find("#mxm_tot_y").val(maxtotVal);
 
   // }else{
   //    if(notationVal=='mo'){
   //       $(this).parent().parent().find("#mom_tot_y").val("0")

   //       if(seldval){
   //          if((isNumeric(seldval))){
   //             if(mminputData){
   //                $(this).parent().parent().find("#gd_"+comKeyValue).val(gradeCalculate(mminputData,moinputData))
   //             }
   //          }else{
   //          $(this).parent().parent().find("#gd_"+comKeyValue).val("NA")
   //          }
   //       }

   //       let moval1=$(this).parent().parent().find("#mo_"+(comKeyValue.split("_")[0])+"_1").val()
   //       let moval2=$(this).parent().parent().find("#mo_"+(comKeyValue.split("_")[0])+"_2").val();
   //       let maxobtaintotVal=0;
   //       if(moval1 && isNumeric(moval1)){
   //        maxobtaintotVal=maxobtaintotVal+(1*moval1);
   //       }
   //       if(moval2 && isNumeric(moval2)){
   //         maxobtaintotVal=maxobtaintotVal+(1*moval2);
   //       }
   //       $(this).parent().parent().find("#mom_tot_y").val(maxobtaintotVal);


   //       let totalmarkagsub=$(this).parent().parent().find("#mxm_tot_y").val()
   //       let totalmarkobtainagsub=$(this).parent().parent().find("#mom_tot_y").val();

   //       console.log("totalmarkagsub + "+totalmarkagsub+" : "+totalmarkobtainagsub)

   //       $(this).parent().parent().find("#mog_tot_y").val(gradeCalculate(totalmarkagsub,totalmarkobtainagsub));
   //    }
   // }
   

    //console.log("+++++++++++++++++++++++++ : "+mminputData+" :moinputData: "+moinputData+" :notationVal : "+notationVal)
 });




//-----------------END------------------------------------------

//--------------------Dropdown selection months------------------

$(document).on('change','.dropdownchange', function(){
   let attrId= $(this).attr("id");
   let values=$(this).val()
   console.log("------------------- IDS : "+attrId+" values :",values)

   if(values.length>0){
   
      
      $("#value_"+attrId).attr("readonly",false);
   }else{
      $("#value_"+attrId).attr("readonly",true);
      $('#value_'+attrId).val(0);
   }


});

//--------------------END---------------------------------------


$(document).on('change','#selectPaymentMode', function(){
  console.log(" selectPaymentMode ================================= ")
 let mode = $(this).val();
 let htm=``;
 if(mode=='Cash'){
   htm=``;
 }else{
  htm=`<div class="col-12 col-sm-6">
  <div class="form-group">
        <label> Select payment type</label>
        
        <select name="paymentType" required class="form-control select">
           <option value="">Select payment type</option>
           <option value="googlePay">Gpay</option>
           <option value="phonePay">phonePay</option>
           <option value="Paytm" >Paytm</option>
           <option value="Other" >Other</option>   

        </select>
  </div>
  </div>
  

  <div class="col-12 col-sm-6">
     <div class="form-group">
        <label>Online Paid Ref : No</label>
        <input type="text" value="" name="onlineRefNo" class="form-control">
     </div>
  </div>`
 }
 $('#modeOnlineHtmlInput').html(htm);
 console.log(" selectPaymentMode ================================= " + mode)
 
});
