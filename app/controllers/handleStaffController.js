//-----------------------------------------------------------
//-------handleStaffController ------------------------------
//-----------------------------------------------------------
app.controller('handleStaffController', function(   $scope, 
                                                    housekeeping, 
                                                    $modal,
                                                    dbUserService )
{


    $scope.userTypes                                = [ { userType : UT_STAFF,     display : "Staff"       },
                                                        { userType : UT_MANAGER,   display : "Manager"     } ];

    $scope.submitAddStaff                        = { isSubmitted : false };
    $scope.isShowErrorBox_addStaff               = false;
    $scope.isShowSuccessBox_addStaff             = false;
    $scope.errorMessages                         = [];
    $scope.successMessage                        = "";

    $scope.formData_addStaff                     = {};

    $scope.formData_addStaff.selectedUserType    = $scope.userTypes[0];    
    $scope.formData_addStaff.userType            = "";    
    $scope.formData_addStaff.firstname           = "";
    $scope.formData_addStaff.lastname            = "";
    $scope.formData_addStaff.email               = "";
    $scope.formData_addStaff.phone               = "";
    $scope.formData_addStaff.password            = "";
    $scope.formData_addStaff.passwordConfirm     = "";



    $scope.saveStaff                             = function()
    {
        $scope.errorMessages    = []; // create new array

        if( ( typeof $scope.formData_addStaff.firstname == 'undefined' )  || ( $scope.formData_addStaff.firstname  == "" ) )  { $scope.errorMessages.push( "Missing Firstname"        ); }                                       
        if( ( typeof $scope.formData_addStaff.lastname  == 'undefined' )  || ( $scope.formData_addStaff.lastname   == "" ) )  { $scope.errorMessages.push( "Missing Lastname"         ); }
        if( ( typeof $scope.formData_addStaff.email     == 'undefined' )  || ( $scope.formData_addStaff.email      == "" ) )  { $scope.errorMessages.push( "Missing Email"            ); }
        if( !isValidEmail( $scope.formData_addStaff.email ) )                                                                 { $scope.errorMessages.push( "Invalid Email"            ); }
        if( ( typeof $scope.formData_addStaff.phone     == 'undefined' )  || ( $scope.formData_addStaff.phone      == "" ) )  { $scope.errorMessages.push( "Missing Phone"            ); }
        if( ( typeof $scope.formData_addStaff.password  == 'undefined' )  || ( $scope.formData_addStaff.password   == "" ) )  { $scope.errorMessages.push( "Missing Password"         ); }
        if( !isPasswordSecureEnough( $scope.formData_addStaff.password ) )                                                    { $scope.errorMessages.push( "Password NOT Secure Enough. Must be at least 7 characters, a number, and a letter\n" ); }
        if( $scope.formData_addStaff.password != $scope.formData_addStaff.passwordConfirm )                                   { $scope.errorMessages.push( "Passwords Do NOT Match"   ); }

        $scope.formData_addStaff.userType = $scope.formData_addStaff.selectedUserType.userType;

        if( 0 == $scope.errorMessages.length )    
        {   
            housekeeping.isShow_ajaxLoader       = true;
            $scope.isShowErrorBox_addStaff       = false;
            $scope.isShowSuccessBox_addStaff     = false;
            dbUserService.addUser( $scope, $scope.formData_addStaff );  
        }
        else
        { 
            var mainContentHeight = (16 * $scope.errorMessages.length) + 500;
            housekeeping.mainContentHeight = mainContentHeight + "px"; // dynamically adjust height of screen  

            $scope.isShowErrorBox_addStaff       = true;
            $scope.submitAddStaff.isSubmitted    = true;                           
        }



    } // $scope.saveStaff

    //-------------------------------------------------------
    // ajax Response Handlers
    //-------------------------------------------------------
    $scope.addUserFailure   =   function( data )                                      
                                {
                                    alert("Failed");

                                    var message                             = stripMessageFromAjaxData( data );
                                    $scope.errorMessages.push( message );
                                    housekeeping.mainContentHeight          = "600px";
                                    $scope.isShowErrorBox_addStaff          = true;
                                    $scope.isShowSuccessBox_addStaff        = false;
                                    housekeeping.isShow_ajaxLoader          = false;
                                            
                                } // $scope.addStaffFailure  

    $scope.addUserSuccess   =   function( data )  
                                {
                                    alert("Success");

                                    $scope.successMessage                   = "Successfully Added Staff";
                                    housekeeping.mainContentHeight          = "600px";
                                    $scope.isShowSuccessBox_addStaff        = true;
                                    $scope.isShowErrorBox_addStaff          = false;
                                    housekeeping.isShow_ajaxLoader          = false;
                                        
                                } // $scope.addStaffSuccess




    // ---------------------------------------------------------------------------------
    // Search Staff
    //

    $scope.submitUpdatePersonalDetails                  = { isSubmitted : false };
    $scope.submitUpdatePassword                         = { isSubmitted : false };

    $scope.isShowErrorBox_updateStaff                   = false;
    $scope.isShowSuccessBox_updateStaff                 = false;

    $scope.userTypesforSearch                           = [ { userType : "",           display : ""            },
                                                            { userType : UT_STAFF,     display : "Staff"       },
                                                            { userType : UT_MANAGER,   display : "Manager"     } ];


    $scope.isCollapsed_searchResultsStaffToUpdate       = true;
    $scope.isShow_searchResultsStaffToUpdate_listing    = true; //false;
    $scope.isShow_searchResultsStaffToUpdate_noResults  = false;     
    $scope.isShow_searchResultsStaffToUpdate_detail     = false;

    $scope.isCollapsed_updatePersonalDetails            = false;
    $scope.isCollapsed_updatePassword                   = true;
    $scope.isCollapsed_getStaffToUpdate                 = false;
    $scope.formData_updateStaff                         = {};

    $scope.formData_updateStaff.idUser                      = -1;    
    $scope.formData_updateStaff.selectedUserType            = $scope.userTypes[0];    
    $scope.formData_updateStaff.selectedUserTypeForSearch   = $scope.userTypesforSearch[0];    
    $scope.formData_updateStaff.userType                    = "";    
    $scope.formData_updateStaff.firstname                   = "";
    $scope.formData_updateStaff.lastname                    = "";
    $scope.formData_updateStaff.email                       = "";
    $scope.formData_updateStaff.phone                       = "";

    $scope.formData_updateStaff.oldPassword             = "";
    $scope.formData_updateStaff.newPassword             = "";
    $scope.formData_updateStaff.confirmPassword         = "";


    $scope.staffToUpdateCollection                      = [];
    $scope.selectedStaffToUpdate                        = "";


    // ---------------------------------------------------------------------------------
    $scope.clearStaffToUpdateFields              = function()
    {
        $scope.formData_updateStaff.selectedUserTypeForSearch   = $scope.userTypesforSearch[0];    
        $scope.formData_updateStaff.firstname                   = "";
        $scope.formData_updateStaff.lastname                    = "";
        $scope.formData_updateStaff.email                       = "";
        $scope.formData_updateStaff.phone                       = "";

    } // $scope.clearStaffToUpdateFields

    // ---------------------------------------------------------------------------------
    $scope.getStaffToUpdate                      = function()
    {
        housekeeping.isShow_ajaxLoader = true;
        $scope.formData_updateStaff.userType = $scope.formData_updateStaff.selectedUserTypeForSearch.userType;

        dbUserService.getUserToUpdate( $scope, $scope.formData_updateStaff );

    } // $scope.getStaffToUpdate

    //-------------------------------------------------------
    // ajax Response Handlers
    //-------------------------------------------------------
    $scope.getUserToUpdateFailure = function( data ) 
                                    {
                                        alert("Failed");

                                        var message                             = stripMessageFromAjaxData( data );
                                        $scope.errorMessages.push( message );
                                        housekeeping.mainContentHeight          = "600px";
                                        $scope.isShowErrorBox_addStaff          = true;
                                        $scope.isShowSuccessBox_addStaff        = false;
                                        housekeeping.isShow_ajaxLoader          = false;

                                    } // $scope.addStaffFailure  

    $scope.getUserToUpdateSuccess = function( data )  
                                    {

                                        housekeeping.isShow_ajaxLoader                           = false;
                                        $scope.isCollapsed_searchResultsStaffToUpdate            = false;
                                        $scope.staffToUpdateCollection                           = JSON.parse( stripDataFromAjaxData( data ));

                                        switch( $scope.staffToUpdateCollection.length )      
                                        {
                                            case 0: // No Result
                                                $scope.isShow_searchResultsStaffToUpdate_noResults    = true;     
                                                $scope.isShow_searchResultsStaffToUpdate_listing      = false;     
                                                $scope.isShow_searchResultsStaffToUpdate_detail       = false;    housekeeping.mainContentHeight = "500px"; // dynamically adjust height of screen                                                  
                                                break;

                                            case 1: // Detail
                                                $scope.isShow_searchResultsStaffToUpdate_noResults    = false;     
                                                $scope.selectStaffFromListing( 0 );
                                                break;

                                            default: // Listing                                                        
                                                $scope.isShow_searchResultsStaffToUpdate_listing      = true;     
                                                $scope.isShow_searchResultsStaffToUpdate_noResults    = false;     
                                                $scope.isShow_searchResultsStaffToUpdate_detail       = false;    housekeeping.mainContentHeight = "700px"; // dynamically adjust height of screen
                                                $scope.isShow_backToStaffToUpdateListingButton        = true;
                                                $scope.isCollapsed_getStaffToUpdate                   = true;
                                        }


                                    } // $scope.addStaffSuccess

    // ---------------------------------------------------------------------------------
    $scope.displayUserTypeForListing      = function( userType )
    {
        return ( userType == UT_STAFF )? "Staff" : "Manager";

    } // $scope.displayUserTypeForListing

    // ---------------------------------------------------------------------------------

    $scope.selectStaffFromListing         =   function( idx )
    {

        $scope.selectedStaffToUpdate                             = $scope.staffToUpdateCollection[ idx ];
        $scope.isShow_searchResultsStaffToUpdate_listing         = false;     
        $scope.isShow_searchResultsStaffToUpdate_detail          = true;     housekeeping.mainContentHeight = "1265px"; // dynamically adjust height of screen  
        $scope.isCollapsed_getStaffToUpdate                      = true;
        $scope.isShow_enterValues                                = true;

        updateStaffScopeData( $scope, $scope.formData_updateStaff, $scope.selectedStaffToUpdate );

    } // $scope.selectCarFromListing

    //-----------------------------------------------------------
    $scope.goBackToStaffToUpdateListing   =   function()
    {
        $scope.errorMessages                                    = [];
        $scope.successMessage                                   = "";
        $scope.isShowErrorBox_updateStaff                    = false;
        $scope.isShowSuccessBox_updateStaff                  = false;

        $scope.isShow_searchResultsStaffToUpdate_listing     = ( $scope.staffToUpdateCollection.length > 0 )? true : false;     
        $scope.isShow_searchResultsStaffToUpdate_detail      = false;    housekeeping.mainContentHeight = "700px"; // dynamically adjust height of screen

    } // $scope.goBackToStaffToUpdateListing

    //-----------------------------------------------------------
    $scope.updateStaffCancel             =   function() { $scope.goBackToStaffToUpdateListing(); }

    //-----------------------------------------------------------
    $scope.updatePersonalDetails            =   function()
    {
        $scope.submitUpdatePersonalDetails.isSubmitted  = false; 
        $scope.errorMessages                            = []; // create new array

        if( ( typeof $scope.formData_updateStaff.firstname == 'undefined' )  || ( $scope.formData_updateStaff.firstname  == "" ) )  { $scope.errorMessages.push( "Missing Firstname"        ); }                                       
        if( ( typeof $scope.formData_updateStaff.lastname  == 'undefined' )  || ( $scope.formData_updateStaff.lastname   == "" ) )  { $scope.errorMessages.push( "Missing Lastname"         ); }
        if( ( typeof $scope.formData_updateStaff.email     == 'undefined' )  || ( $scope.formData_updateStaff.email      == "" ) )  { $scope.errorMessages.push( "Missing Email"            ); }
        if( !isValidEmail( $scope.formData_updateStaff.email ) )                                                                    { $scope.errorMessages.push( "Invalid Email"            ); }
        if( ( typeof $scope.formData_updateStaff.phone     == 'undefined' )  || ( $scope.formData_updateStaff.phone      == "" ) )  { $scope.errorMessages.push( "Missing Phone"            ); }

        //$scope.formData_updateStaff.userType = $scope.formData_updateStaff.selectedUserType.value;

        if( 0 == $scope.errorMessages.length )    
        {   
            housekeeping.isShow_ajaxLoader           = true;
            $scope.isShowErrorBox_updateStaff        = false;
            $scope.isShowSuccessBox_updateStaff      = false;

            dbUserService.updateUserPersonalDetails( $scope, $scope.formData_updateStaff );  
        }
        else
        { 
            var mainContentHeight = (16 * $scope.errorMessages.length) + 810;
            housekeeping.mainContentHeight = mainContentHeight + "px"; // dynamically adjust height of screen  

            $scope.isShowErrorBox_updateStaff       = true;
            $scope.isShowSuccessBox_updateStaff     = true;
            $scope.submitupdateStaff.isSubmitted    = true;                           
        }


    } // $scope.updatePersonalDetails


    
    //-------------------------------------------------------
    // ajax Response Handlers
    //-------------------------------------------------------
    $scope.updateUserPersonalDetailsFailure =   function( data )                                      
                                                {

                                                    //alert("Failed");

                                                    var message                             = stripMessageFromAjaxData( data );
                                                    $scope.errorMessages.push( message );
                                                    housekeeping.mainContentHeight          = "820px";
                                                    $scope.isShowErrorBox_updateStaff       = true;
                                                    $scope.isShowSuccessBox_updateStaff     = false;
                                                    housekeeping.isShow_ajaxLoader          = false;
                                           
                                                } // $scope.addStaffFailure  

    $scope.updateUserPersonalDetailsSuccess =   function( data )  
                                                {
                                                    //alert("Success");

                                                    updateSelectedStaffToUpdateRecordFromFormData( $scope.selectedStaffToUpdate, $scope.formData_updateStaff ); // update listing data 

                                                    $scope.successMessage                   = "Successfully Updated Staff";
                                                    housekeeping.mainContentHeight          = "820px";
                                                    $scope.isShowSuccessBox_updateStaff     = true;
                                                    $scope.isShowErrorBox_updateStaff       = false;
                                                    housekeeping.isShow_ajaxLoader          = false;
                                        
                                                } // $scope.addStaffSuccess




    //-----------------------------------------------------------
    //-----------------------------------------------------------
    $scope.updatePassword            = function()
    {
        $scope.submitUpdatePassword.isSubmitted     = false;                           
        $scope.errorMessages                        = []; // create new array


        //if( ( typeof $scope.formData_updateStaff.oldPassword  == 'undefined' )  || ( $scope.formData_updateStaff.oldPassword   == "" ) )  { $scope.errorMessages.push( "Missing Old Password"     ); }
        if( ( typeof $scope.formData_updateStaff.newPassword  == 'undefined' )  || ( $scope.formData_updateStaff.newPassword   == "" ) )  { $scope.errorMessages.push( "Missing New Password"     ); }
        if( !isPasswordSecureEnough( $scope.formData_updateStaff.newPassword ) )                                                          { $scope.errorMessages.push( "New Password NOT Secure Enough. Must be at least 7 characters, a number, and a letter\n" ); }
        if( $scope.formData_updateStaff.newPassword != $scope.formData_updateStaff.confirmPassword )                                      { $scope.errorMessages.push( "Passwords Do NOT Match"   ); }



        if( 0 == $scope.errorMessages.length )    
        {   
            housekeeping.isShow_ajaxLoader              = true;
            $scope.isShowErrorBox_updateStaff           = false;
            $scope.isShowSuccessBox_updateStaff         = false;
            dbUserService.updateUserPassword( $scope, $scope.formData_updateStaff );  
        }
        else
        { 
            var mainContentHeight = (16 * $scope.errorMessages.length) + 810;
            housekeeping.mainContentHeight = mainContentHeight + "px"; // dynamically adjust height of screen  

            $scope.isShowErrorBox_updateStaff           = true;
            $scope.isShowSuccessBox_updateStaff         = false;
            $scope.submitUpdatePassword.isSubmitted     = true;                           

        }

    } // $scope.updatePassword 

    //-------------------------------------------------------
    // ajax Response Handlers
    //-------------------------------------------------------
    $scope.updateUserPasswordFailure =  function( data )                                      
                                        {
                                            alert("Update Failed");

                                            var message                             = stripMessageFromAjaxData( data );
                                            $scope.errorMessages.push( message );
                                            housekeeping.mainContentHeight          = "820px";
                                            $scope.isShowErrorBox_updateStaff       = true;
                                            $scope.isSuccessErrorBox_updateStaff    = false;
                                            housekeeping.isShow_ajaxLoader = false;
                                           
                                        } // $scope.updateUserPasswordFailure

    $scope.updateUserPasswordSuccess =  function( data )  
                                        {

                                            alert("Update Succeeded");

                                            $scope.successMessage                   = "Successfully Updated Password";
                                            housekeeping.mainContentHeight          = "820px";
                                            $scope.isShowErrorBox_updateStaff       = false;
                                            $scope.isShowSuccessBox_updateStaff     = true;
                                            housekeeping.isShow_ajaxLoader          = false;
                                        
                                        } // $scope.updateUserPasswordSuccess


    //-----------------------------------------------------------
    // deleteUser
    //-----------------------------------------------------------
    $scope.deleteUser            = function()
    {
        var StaffName                = $scope.formData_updateStaff.firstname + " " + $scope.formData_updateStaff.lastname;

        var messageDetails              =   { 
                                                title               : "Please Confirm Deletion",
                                                message1            : "Staff: ",
                                                message1_highlight  : StaffName, 
                                                message2            : "Email: ",
                                                message2_highlight  : $scope.formData_updateStaff.email
                                            };

        var objConfirmDeletionDialog    =   $modal.open( 
                                            {
                                                templateUrl :   'confirmDeletion.htm',
                                                controller  :   'dialogConfirmDeletionController',
                                                windowClass :   'dialogConfirmDeletion',
                                                resolve     :   {
                                                                    messageDetails : function() { return messageDetails; }
                                                                }
                                            })
                                            .result.then( function()
                                            {
                                                dbUserService.deleteUser( $scope, $scope.formData_updateStaff ); // make ajax call to delete Staff in DB
                                            },
                                            function()
                                            {
                                                //alert( 'dismissed' );
                                            });



    } // $scope.deleteUser



    //-------------------------------------------------------
    // ajax Response Handlers
    //-------------------------------------------------------
    $scope.deleteUserFailure        =   function( data )                                      
                                        {
                                            alert("Delete Failed");

                                            var message                             = stripMessageFromAjaxData( data );
                                            $scope.errorMessages                    = [];
                                            $scope.errorMessages.push( message );
                                            housekeeping.mainContentHeight          = "820px";
                                            housekeeping.isShow_ajaxLoader = false;
                                           
                                        } // $scope.updateUserPasswordFailure

    $scope.deleteUserSuccess        =   function( data )  
                                        {

                                            alert("Deletion Succeeded");

                                            housekeeping.isShow_ajaxLoader          = false;
                                        
                                            var idxStaff = -1;
                                            for( var iStaff in $scope.staffToUpdateCollection ) { if( $scope.staffToUpdateCollection[ iStaff ].idUser == $scope.selectedStaffToUpdate.idUser ) { idxStaff = iStaff; break; } }
                                            $scope.staffToUpdateCollection.splice( idxStaff, 1 );  // remove car from collection
                                            $scope.goBackToStaffToUpdateListing();

                                        } // $scope.updateUserPasswordSuccess



}); // handleStaffController


//-------------------------------------------------------
// Normal / Non-Angular functions
//-------------------------------------------------------

//-------------------------------------------------------
// updateStaffScopeData
//
// Description: copies data from selected record to formData
//-------------------------------------------------------
function updateStaffScopeData( $scope, formData, selectedUserToUpdate )
{
    formData.idUser         = selectedUserToUpdate.idUser;
    formData.firstname      = selectedUserToUpdate.firstname;
    formData.lastname       = selectedUserToUpdate.lastname;
    formData.email          = selectedUserToUpdate.email;
    formData.phone          = selectedUserToUpdate.phone;

    var idxUserType = 0;
    for( var iUserType in $scope.userTypes ) { if( $scope.userTypes[ iUserType ].userType == selectedUserToUpdate.userType ) { idxUserType = iUserType; break; } }
    formData.selectedUserType  = $scope.userTypes[ idxUserType ];
    formData.userType          = $scope.userTypes[ idxUserType ].userType;


} // updateStaffScopeData


//-------------------------------------------------------
// updateSelectedStaffToUpdateRecordFromFormData
//
// Description: copies data from formData to selected record 
//-------------------------------------------------------
function updateSelectedStaffToUpdateRecordFromFormData( selectedUserToUpdate, formData )
{
    selectedUserToUpdate.idUser         = formData.idUser;
    selectedUserToUpdate.firstname      = formData.firstname;
    selectedUserToUpdate.lastname       = formData.lastname;
    selectedUserToUpdate.email          = formData.email;
    selectedUserToUpdate.phone          = formData.phone;
    selectedUserToUpdate.userType       = formData.selectedUserType.userType;

} // updateSelectedStaffToUpdateRecordFromFormData

