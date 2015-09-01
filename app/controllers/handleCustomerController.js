//-----------------------------------------------------------
//-------handleCustomerController ------------------------------
//-----------------------------------------------------------
app.controller('handleCustomerController', function(    $scope, 
                                                        housekeeping, 
                                                        $modal,
                                                        dbUserService )
{

    // Add Customer
    //
    $scope.submitAddCustomer                        = { isSubmitted : false };
    $scope.isShowErrorBox_addCustomer               = false;
    $scope.isShowSuccessBox_addCustomer             = false;
    $scope.errorMessages                            = [];
    $scope.successMessage                           = "";

    $scope.formData_addCustomer                     = {};

    $scope.formData_addCustomer.userType            = UT_CUSTOMER;    
    $scope.formData_addCustomer.firstname           = "";
    $scope.formData_addCustomer.lastname            = "";
    $scope.formData_addCustomer.email               = "";
    $scope.formData_addCustomer.phone               = "";
    $scope.formData_addCustomer.password            = "";
    $scope.formData_addCustomer.passwordConfirm     = "";

    $scope.saveCustomer                             = function()
    {
        $scope.errorMessages    = []; // create new array

        if( ( typeof $scope.formData_addCustomer.firstname == 'undefined' )  || ( $scope.formData_addCustomer.firstname  == "" ) )  { $scope.errorMessages.push( "Missing Firstname"        ); }                                       
        if( ( typeof $scope.formData_addCustomer.lastname  == 'undefined' )  || ( $scope.formData_addCustomer.lastname   == "" ) )  { $scope.errorMessages.push( "Missing Lastname"         ); }
        if( ( typeof $scope.formData_addCustomer.email     == 'undefined' )  || ( $scope.formData_addCustomer.email      == "" ) )  { $scope.errorMessages.push( "Missing Email"            ); }
        if( !isValidEmail( $scope.formData_addCustomer.email ) )                                                                    { $scope.errorMessages.push( "Invalid Email"            ); }
        if( ( typeof $scope.formData_addCustomer.phone     == 'undefined' )  || ( $scope.formData_addCustomer.phone      == "" ) )  { $scope.errorMessages.push( "Missing Phone"            ); }
        if( ( typeof $scope.formData_addCustomer.password  == 'undefined' )  || ( $scope.formData_addCustomer.password   == "" ) )  { $scope.errorMessages.push( "Missing Password"         ); }
        if( !isPasswordSecureEnough( $scope.formData_addCustomer.password ) )                                                       { $scope.errorMessages.push( "Password NOT Secure Enough. Must be at least 7 characters, a number, and a letter\n" ); }
        if( $scope.formData_addCustomer.password != $scope.formData_addCustomer.passwordConfirm )                                   { $scope.errorMessages.push( "Passwords Do NOT Match"   ); }

        if( 0 == $scope.errorMessages.length )    
        {   
            housekeeping.isShow_ajaxLoader          = true;
            $scope.isShowErrorBox_addCustomer       = false;
            $scope.isShowSuccessBox_addCustomer     = false;
            dbUserService.addUser( $scope, $scope.formData_addCustomer );  
        }
        else
        { 
            var mainContentHeight = (16 * $scope.errorMessages.length) + 500;
            housekeeping.mainContentHeight = mainContentHeight + "px"; // dynamically adjust height of screen  

            $scope.isShowErrorBox_addCustomer       = true;
            $scope.isShowSuccessBox_addCustomer     = false;
            $scope.submitAddCustomer.isSubmitted    = true;                           
        }

    } // $scope.saveCustomer

    //-------------------------------------------------------
    // ajax Response Handlers
    //-------------------------------------------------------
    $scope.addUserFailure   =   function( data )                                      
                                {

                                    alert("Failed");

                                    var message                             = stripMessageFromAjaxData( data );
                                    $scope.errorMessages                    = [];
                                    $scope.errorMessages.push( message );
                                    housekeeping.mainContentHeight          = "600px";
                                    $scope.isShowErrorBox_addCustomer       = true;
                                    $scope.isShowSuccessBox_addCustomer     = false;
                                    housekeeping.isShow_ajaxLoader          = false;
                                           
                                } // $scope.addCustomerFailure  

    $scope.addUserSuccess   =   function( data )  
                                {

                                    alert("Success");

                                    $scope.successMessage                   = "Successfully Added Customer";
                                    housekeeping.mainContentHeight          = "600px";
                                    $scope.isShowSuccessBox_addCustomer     = true;
                                    $scope.isShowErrorBox_addCustomer       = false;
                                    housekeeping.isShow_ajaxLoader          = false;
                                        
                                } // $scope.addCustomerSuccess



    // ---------------------------------------------------------------------------------
    // Search Customer
    //

    $scope.submitUpdatePersonalDetails                      = { isSubmitted : false };
    $scope.submitUpdatePassword                             = { isSubmitted : false };

    $scope.isShowErrorBox_updateCustomer                    = false;
    $scope.isShowSuccessBox_updateCustomer                  = false;

    $scope.isCollapsed_searchResultsCustomerToUpdate        = true;
    $scope.isShow_searchResultsCustomerToUpdate_listing     = true; //false;
    $scope.isShow_searchResultsCustomerToUpdate_noResults   = false;     
    $scope.isShow_searchResultsCustomerToUpdate_detail      = false;

    $scope.isCollapsed_updatePersonalDetails            = false;
    $scope.isCollapsed_updatePassword                   = true;
    $scope.isCollapsed_getCustomerToUpdate              = false;
    $scope.formData_updateCustomer                      = {};

    $scope.formData_updateCustomer.idUser               = -1;    
    $scope.formData_updateCustomer.userType             = UT_CUSTOMER;    
    $scope.formData_updateCustomer.firstname            = "";
    $scope.formData_updateCustomer.lastname             = "";
    $scope.formData_updateCustomer.email                = "";
    $scope.formData_updateCustomer.phone                = "";

    $scope.formData_updateCustomer.oldPassword          = "";
    $scope.formData_updateCustomer.newPassword          = "";
    $scope.formData_updateCustomer.confirmPassword      = "";


    $scope.customerToUpdateCollection                   = [];
    $scope.selectedCustomerToUpdate                     = "";


    // ---------------------------------------------------------------------------------
    $scope.clearCustomerToUpdateFields              = function()
    {
        $scope.formData_updateCustomer.firstname            = "";
        $scope.formData_updateCustomer.lastname             = "";
        $scope.formData_updateCustomer.email                = "";
        $scope.formData_updateCustomer.phone                = "";

    } // $scope.clearCustomerToUpdateFields

    // ---------------------------------------------------------------------------------
    $scope.getCustomerToUpdate                      = function()
    {
        housekeeping.isShow_ajaxLoader = true;
        dbUserService.getUserToUpdate( $scope, $scope.formData_updateCustomer );

    } // $scope.getCustomerToUpdate

    //-------------------------------------------------------
    // ajax Response Handlers
    //-------------------------------------------------------
    $scope.getUserToUpdateFailure = function( data ) 
                                    {
                                        alert("Failed");

                                        var message                             = stripMessageFromAjaxData( data );
                                        $scope.errorMessages.push( message );
                                        housekeeping.mainContentHeight          = "600px";
                                        $scope.isShowErrorBox_addCustomer       = true;
                                        $scope.isShowSuccessBox_addCustomer     = false;
                                        housekeeping.isShow_ajaxLoader = false;

                                    } // $scope.addCustomerFailure  

    $scope.getUserToUpdateSuccess = function( data )  
                                    {

                                        housekeeping.isShow_ajaxLoader                              = false;
                                        $scope.isCollapsed_searchResultsCustomerToUpdate            = false;
                                        $scope.customerToUpdateCollection                           = JSON.parse( stripDataFromAjaxData( data ));

                                        switch( $scope.customerToUpdateCollection.length )      
                                        {
                                            case 0: // No Result
                                                $scope.isShow_searchResultsCustomerToUpdate_noResults    = true;     
                                                $scope.isShow_searchResultsCustomerToUpdate_listing      = false;     
                                                $scope.isShow_searchResultsCustomerToUpdate_detail       = false;    housekeeping.mainContentHeight = "500px"; // dynamically adjust height of screen                                                  
                                                break;

                                            case 1: // Detail
                                                $scope.selectCustomerFromListing( 0 );
                                                break;

                                            default: // Listing                                                                                                   
                                                $scope.isShow_searchResultsCustomerToUpdate_listing      = true;     
                                                $scope.isShow_searchResultsCustomerToUpdate_noResults    = false;     
                                                $scope.isShow_searchResultsCustomerToUpdate_detail       = false;    housekeeping.mainContentHeight = "700px"; // dynamically adjust height of screen
                                                $scope.isShow_backToCustomerToUpdateListingButton        = true;
                                                $scope.isCollapsed_getCustomerToUpdate                   = true;
                                        }


                                    } // $scope.addCustomerSuccess

    // ---------------------------------------------------------------------------------

    $scope.selectCustomerFromListing         =   function( idx )
    {

        $scope.selectedCustomerToUpdate                             = $scope.customerToUpdateCollection[ idx ];
        $scope.isShow_searchResultsCustomerToUpdate_noResults       = false;     
        $scope.isShow_searchResultsCustomerToUpdate_listing         = false;     
        $scope.isShow_searchResultsCustomerToUpdate_detail          = true;     housekeeping.mainContentHeight = "1265px"; // dynamically adjust height of screen  
        $scope.isCollapsed_getCustomerToUpdate                      = true;
        $scope.isShow_enterValues                                   = true;

        updateUserScopeData( $scope, $scope.formData_updateCustomer, $scope.selectedCustomerToUpdate );

    } // $scope.selectCarFromListing

    //-----------------------------------------------------------
    $scope.goBackToCustomerToUpdateListing   =   function()
    {
        $scope.errorMessages                                    = [];
        $scope.successMessage                                   = "";
        $scope.isShowErrorBox_updateCustomer                    = false;
        $scope.isShowSuccessBox_updateCustomer                  = false;

        $scope.isShow_searchResultsCustomerToUpdate_listing     = ( $scope.customerToUpdateCollection.length > 0 )? true : false;     
        $scope.isShow_searchResultsCustomerToUpdate_detail      = false;    housekeeping.mainContentHeight = "700px"; // dynamically adjust height of screen

    } // $scope.goBackToCustomerToUpdateListing

    //-----------------------------------------------------------
    $scope.updateCustomerCancel             =   function() { $scope.goBackToCustomerToUpdateListing(); }

    //-----------------------------------------------------------
    $scope.updatePersonalDetails            =   function()
    {
        $scope.submitUpdatePersonalDetails.isSubmitted  = false; 
        $scope.errorMessages                            = []; // create new array

        if( ( typeof $scope.formData_updateCustomer.firstname == 'undefined' )  || ( $scope.formData_updateCustomer.firstname  == "" ) )  { $scope.errorMessages.push( "Missing Firstname"        ); }                                       
        if( ( typeof $scope.formData_updateCustomer.lastname  == 'undefined' )  || ( $scope.formData_updateCustomer.lastname   == "" ) )  { $scope.errorMessages.push( "Missing Lastname"         ); }
        if( ( typeof $scope.formData_updateCustomer.email     == 'undefined' )  || ( $scope.formData_updateCustomer.email      == "" ) )  { $scope.errorMessages.push( "Missing Email"            ); }
        if( !isValidEmail( $scope.formData_updateCustomer.email ) )                                                                       { $scope.errorMessages.push( "Invalid Email"            ); }
        if( ( typeof $scope.formData_updateCustomer.phone     == 'undefined' )  || ( $scope.formData_updateCustomer.phone      == "" ) )  { $scope.errorMessages.push( "Missing Phone"            ); }

        if( 0 == $scope.errorMessages.length )    
        {   
            housekeeping.isShow_ajaxLoader              = true;
            $scope.isShowErrorBox_updateCustomer        = false;
            $scope.isShowSuccessBox_updateCustomer      = false;

            dbUserService.updateUserPersonalDetails( $scope, $scope.formData_updateCustomer );  
        }
        else
        { 
            var mainContentHeight = (16 * $scope.errorMessages.length) + 810;
            housekeeping.mainContentHeight = mainContentHeight + "px"; // dynamically adjust height of screen  

            $scope.isShowErrorBox_updateCustomer       = true;
            $scope.isShowSuccessBox_updateCustomer     = false;
            $scope.submitupdateCustomer.isSubmitted    = true;                           
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
                                                    $scope.isShowErrorBox_updateCustomer    = true;
                                                    $scope.isShowSuccessBox_updateCustomer    = false;
                                                    housekeeping.isShow_ajaxLoader = false;
                                           
                                                } // $scope.addCustomerFailure  

    $scope.updateUserPersonalDetailsSuccess =   function( data )  
                                                {
                                                    //alert("Success");

                                                    updateSelectedUserToUpdateRecordFromFormData( $scope.selectedCustomerToUpdate, $scope.formData_updateCustomer ); // update listing data 

                                                    $scope.successMessage                   = "Successfully Updated Customer";
                                                    housekeeping.mainContentHeight          = "820px";
                                                    $scope.isShowSuccessBox_updateCustomer  = true;
                                                    $scope.isShowErrorBox_updateCustomer    = false;
                                                    housekeeping.isShow_ajaxLoader          = false;
                                        
                                                } // $scope.addCustomerSuccess




    //-----------------------------------------------------------
    //-----------------------------------------------------------
    $scope.updatePassword            = function()
    {
        $scope.submitUpdatePassword.isSubmitted     = false;                           
        $scope.errorMessages                        = []; // create new array


//        if( ( typeof $scope.formData_updateCustomer.oldPassword  == 'undefined' )  || ( $scope.formData_updateCustomer.oldPassword   == "" ) )  { $scope.errorMessages.push( "Missing Old Password"     ); }
        if( ( typeof $scope.formData_updateCustomer.newPassword  == 'undefined' )  || ( $scope.formData_updateCustomer.newPassword   == "" ) )  { $scope.errorMessages.push( "Missing New Password"     ); }
        if( !isPasswordSecureEnough( $scope.formData_updateCustomer.newPassword ) )                                                             { $scope.errorMessages.push( "New Password NOT Secure Enough. Must be at least 7 characters, a number, and a letter\n" ); }
        if( $scope.formData_updateCustomer.newPassword != $scope.formData_updateCustomer.confirmPassword )                                      { $scope.errorMessages.push( "Passwords Do NOT Match"   ); }



        if( 0 == $scope.errorMessages.length )    
        {   
            housekeeping.isShow_ajaxLoader              = true;
            $scope.isShowErrorBox_updateCustomer        = false;
            $scope.isShowSuccessBox_updateCustomer      = false;
            dbUserService.updateUserPassword( $scope, $scope.formData_updateCustomer );  
        }
        else
        { 
            var mainContentHeight = (16 * $scope.errorMessages.length) + 810;
            housekeeping.mainContentHeight = mainContentHeight + "px"; // dynamically adjust height of screen  

            $scope.isShowErrorBox_updateCustomer       = true;
            $scope.isShowSuccessBox_updateCustomer     = false;
            $scope.submitUpdatePassword.isSubmitted    = true;                           

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
                                            $scope.isShowErrorBox_updateCustomer    = true;
                                            $scope.isShowSuccessBox_updateCustomer  = false;
                                            housekeeping.isShow_ajaxLoader = false;
                                           
                                        } // $scope.updateUserPasswordFailure

    $scope.updateUserPasswordSuccess =  function( data )  
                                        {

                                            alert("Update Succeeded");

                                            $scope.successMessage                   = "Successfully Updated Password";
                                            housekeeping.mainContentHeight          = "820px";
                                            $scope.isShowSuccessBox_updateCustomer  = true;
                                            $scope.isShowErrorBox_updateCustomer    = false;
                                            housekeeping.isShow_ajaxLoader          = false;
                                        
                                        } // $scope.updateUserPasswordSuccess


    //-----------------------------------------------------------
    // deleteUser
    //-----------------------------------------------------------
    $scope.deleteUser            = function()
    {
        var customerName                = $scope.formData_updateCustomer.firstname + " " + $scope.formData_updateCustomer.lastname;

        var messageDetails              =   { 
                                                title               : "Please Confirm Deletion",
                                                message1            : "Customer: ",
                                                message1_highlight  : customerName, 
                                                message2            : "Email: ",
                                                message2_highlight  : $scope.formData_updateCustomer.email
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
                                                dbUserService.deleteUser( $scope, $scope.formData_updateCustomer ); // make ajax call to delete customer in DB
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
                                        
                                            var idxCustomer = -1;
                                            for( var iCustomer in $scope.customerToUpdateCollection ) { if( $scope.customerToUpdateCollection[ iCustomer ].idUser == $scope.selectedCustomerToUpdate.idUser ) { idxCustomer = iCustomer; break; } }
                                            $scope.customerToUpdateCollection.splice( idxCustomer, 1 );  // remove car from collection
                                            $scope.goBackToCustomerToUpdateListing();

                                        } // $scope.updateUserPasswordSuccess




}); // handleCustomerController


//-------------------------------------------------------
// Normal / Non-Angular functions
//-------------------------------------------------------

//-------------------------------------------------------
// updateUserScopeData
//
// Description: copies data from selected record to formData
//-------------------------------------------------------
function updateUserScopeData( $scope, formData, selectedUserToUpdate )
{
    formData.idUser         = selectedUserToUpdate.idUser;
    formData.firstname      = selectedUserToUpdate.firstname;
    formData.lastname       = selectedUserToUpdate.lastname;
    formData.email          = selectedUserToUpdate.email;
    formData.phone          = selectedUserToUpdate.phone;


} // updateUserScopeData


//-------------------------------------------------------
// updateSelectedUserToUpdateRecordFromFormData
//
// Description: copies data from formData to selected record 
//-------------------------------------------------------
function updateSelectedUserToUpdateRecordFromFormData( selectedUserToUpdate, formData )
{
    selectedUserToUpdate.idUser         = formData.idUser;
    selectedUserToUpdate.firstname      = formData.firstname;
    selectedUserToUpdate.lastname       = formData.lastname;
    selectedUserToUpdate.email          = formData.email;
    selectedUserToUpdate.phone          = formData.phone;

} // updateSelectedUserToUpdateRecordFromFormData

