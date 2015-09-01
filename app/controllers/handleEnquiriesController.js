//-----------------------------------------------------------
//-------handleEnquiriesController ------------------------------
//-----------------------------------------------------------
app.controller('handleEnquiriesController', function(   $scope, 
                                                        housekeeping, 
                                                        $modal,
                                                        dbEnquiryService )
{

    $scope.statusTypes                                  = [ { statusType : ES_LODGED,       display : "Lodged"      },
                                                            { statusType : ES_PROCESSING,   display : "Processing"  },
                                                            { statusType : ES_CLOSED,       display : "Closed"      } ];


    $scope.submitUpdatePassword                         = { isSubmitted : false };

    $scope.isShowErrorBox_updateEnquiry                 = false;
    $scope.isShowSuccessBox_updateEnquiry               = false;
    $scope.errorMessages                                = [];
    $scope.successMessage                               = "";

    $scope.isCollapsed_getEnquiryToUpdate               = false;
    $scope.isCollapsed_searchResultsEnquiryToUpdate     = false;


    // fields used for searching enquiry
    //
    $scope.formData_updateEnquiry                       = {};
    $scope.formData_updateEnquiry.firstname             = "";    
    $scope.formData_updateEnquiry.lastname              = "";    
    $scope.formData_updateEnquiry.email                 = "";    
    $scope.formData_updateEnquiry.phone                 = "";    
    $scope.formData_updateEnquiry.date                  = "";    

    //- enquiry info
    $scope.formData_updateEnquiry.idUser                = -1;    
    $scope.formData_updateEnquiry.idEnquiry             = "";    
    $scope.formData_updateEnquiry.dateLodged            = ""; //datetime;    
    $scope.formData_updateEnquiry.rego                  = "";    
    $scope.formData_updateEnquiry.enquiry               = "";    
    $scope.formData_updateEnquiry.selectedStatusType    = $scope.statusTypes[0];    

    $scope.enquiriesToUpdateCollection                      = [];
    $scope.isShow_searchResultsEnquiryToUpdate_listing      = false;     
    $scope.isShow_searchResultsEnquiryToUpdate_noResults    = false;     
    $scope.isShow_searchResultsEnquiryToUpdate_detail       = false;    
    $scope.isShow_backToEnquiryToUpdateListingButton        = true;


    //--------------------------------------------------------
    $scope.goBackToEnquiryToUpdateListing               = function()
    {
        $scope.errorMessages                                   = [];
        $scope.successMessage                                  = "";
        $scope.isShowErrorBox_updateEnquiry                    = false;
        $scope.isShowSuccessBox_updateEnquiry                  = false;

        $scope.isShow_searchResultsEnquiryToUpdate_listing     = ( $scope.enquiriesToUpdateCollection.length > 0 )? true : false;     
        $scope.isShow_searchResultsEnquiryToUpdate_detail      = false;    housekeeping.mainContentHeight = "780px"; // dynamically adjust height of screen

    } // $scope.goBackToEnquiryToUpdateListing

    //--------------------------------------------------------
    $scope.updateEnquiryCancel                          = function()
    {
        $scope.goBackToEnquiryToUpdateListing();

    } // $scope.updateEnquiryCancel

    //--------------------------------------------------------
    $scope.clearEnquiryToUpdateFields                   = function()
    {
        $scope.formData_updateEnquiry.firstname             = "";    
        $scope.formData_updateEnquiry.lastname              = "";    
        $scope.formData_updateEnquiry.email                 = "";    
        $scope.formData_updateEnquiry.phone                 = "";    
        $scope.formData_updateEnquiry.dateFrom              = "";    
        $scope.formData_updateEnquiry.dateTo                = "";    

    } // $scope.clearEnquiryToUpdateFields

    //--------------------------------------------------------
    $scope.getEnquiryToUpdate                           = function()
    {
        housekeeping.isShow_ajaxLoader = true;
        dbEnquiryService.getEnquiryToUpdate( $scope, $scope.formData_updateEnquiry );

    } // $scope.getEnquiryToUpdate

    //--------------------------------------------------------
    // AJAX Response Handlers
    //--------------------------------------------------------

    $scope.getEnquiryToUpdateFailure    =   function( data )
                                            {
                                                alert("Failed");

                                                var message                             = stripMessageFromAjaxData( data );
                                                $scope.errorMessages                    = [];
                                                $scope.errorMessages.push( message );
                                                housekeeping.mainContentHeight          = "600px";
                                                $scope.isShowErrorBox_updateEnquiry     = true;
                                                $scope.isShowSuccessBox_updateEnquiry   = false;
                                                housekeeping.isShow_ajaxLoader = false;

                                            } // $scope.getEnquiryToUpdateFailure

    $scope.getEnquiryToUpdateSuccess    =   function( data ) 
                                            {
                                                housekeeping.isShow_ajaxLoader                              = false;
                                                $scope.isCollapsed_searchResultsEnquiryToUpdate             = false;
                                                $scope.enquiriesToUpdateCollection                           = JSON.parse( stripDataFromAjaxData( data ));

                                                switch( $scope.enquiriesToUpdateCollection.length )      
                                                {
                                                    case 0: // No Result
                                                        $scope.isShow_searchResultsEnquiryToUpdate_noResults    = true;     
                                                        $scope.isShow_searchResultsEnquiryToUpdate_listing      = false;     
                                                        $scope.isShow_searchResultsEnquiryToUpdate_detail       = false;    housekeeping.mainContentHeight = "600px"; // dynamically adjust height of screen                                                  
                                                        break;

                                                    case 1: // Detail                                                       
                                                        $scope.selectEnquiryFromListing( 0 );
                                                        break;

                                                    default: // Listing                                                                                                   
                                                        $scope.isShow_searchResultsEnquiryToUpdate_listing      = true;     
                                                        $scope.isShow_searchResultsEnquiryToUpdate_noResults    = false;     
                                                        $scope.isShow_searchResultsEnquiryToUpdate_detail       = false;    housekeeping.mainContentHeight = "800px"; // dynamically adjust height of screen
                                                        $scope.isShow_backToEnquiryToUpdateListingButton        = true;
                                                        $scope.isCollapsed_getEnquiryToUpdate                   = true;
                                                }

                                            } // $scope.getEnquiryToUpdateSuccess

    //-----------------------------------------------------
    $scope.selectEnquiryFromListing         =   function( enquiry )
    {
       
        $scope.selectedEnquiryToUpdate                             = enquiry; //$scope.enquiriesToUpdateCollection[ idx ];
        $scope.isShow_searchResultsEnquiryToUpdate_noResults       = false;     
        $scope.isShow_searchResultsEnquiryToUpdate_listing         = false;     
        $scope.isShow_searchResultsEnquiryToUpdate_detail          = true;     housekeeping.mainContentHeight = "900px"; // dynamically adjust height of screen  
        $scope.isCollapsed_getEnquiryToUpdate                      = true;
        $scope.isShow_enterValues                                  = true;

        updateEnquiryScopeData( $scope, $scope.formData_updateEnquiry, $scope.selectedEnquiryToUpdate );

    } // $scope.selectCarFromListing

    //-----------------------------------------------------
    $scope.getEnquiryStatusForListing       = function( enquiry )
    {
        switch( enquiry.status )
        {
            case ES_LODGED:
                return "Lodged";
                break;

            case ES_PROCESSING:
                return "Processing";
                break;

            case ES_CLOSED:    
                return "Closed";
                break;
        }
        return "Unknown";

    } // $scope.getEnquiryStatusForListing

    //-----------------------------------------------------
    $scope.updateEnquiryStatus              = function()
    {
        housekeeping.isShow_ajaxLoader = true;
        dbEnquiryService.updateEnquiryStatus( $scope, $scope.formData_updateEnquiry );

    } // $scope.updateEnquiryStatus

    //-----------------------------------------------------
    // AJAX Response Handlers
    //--------------------------------------------------------
    $scope.updateEnquiryStatusFailure       =   function( data ) 
                                                {
                                                    alert("Failed");

                                                    var message                             = stripMessageFromAjaxData( data );
                                                    $scope.errorMessages                    = [];
                                                    $scope.errorMessages.push( message );
                                                    $scope.isShowErrorBox_updateEnquiry     = true;
                                                    $scope.isShowSuccessBox_updateEnquiry   = false;
                                                    housekeeping.isShow_ajaxLoader = false;

                                                } // $scope.updateEnquiryStatusFailure

    $scope.updateEnquiryStatusSuccess       =   function( data ) 
                                                {
                                                    updateSelectedEnquiryToUpdateRecordFromFormData( $scope.selectedEnquiryToUpdate, $scope.formData_updateEnquiry ); // update listing data 

                                                    $scope.successMessage                   = stripMessageFromAjaxData( data );
                                                    $scope.isShowErrorBox_updateEnquiry     = false;
                                                    $scope.isShowSuccessBox_updateEnquiry   = true;
                                                    housekeeping.isShow_ajaxLoader          = false;

                                                } // $scope.updateEnquiryStatusSuccess 

    //-----------------------------------------------------
    $scope.deleteEnquiry                    = function()
    {

        var customerName                = $scope.formData_updateEnquiry.firstname + " " + $scope.formData_updateEnquiry.lastname;

        var messageDetails              =   { 
                                                title               : "Please Confirm Deletion",
                                                message1            : "Enquiry by Customer: ",
                                                message1_highlight  : customerName, 
                                                message2            : "Dated: ",
                                                message2_highlight  : $scope.formData_updateEnquiry.dateLodged
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
                                                housekeeping.isShow_ajaxLoader = true;
                                                dbEnquiryService.deleteEnquiry( $scope, $scope.formData_updateEnquiry );
                                            },
                                            function()
                                            {
                                                //alert( 'dismissed' );
                                            });




    } // $scope.deleteEnquiry

    //-----------------------------------------------------
    // AJAX Response Handlers
    //--------------------------------------------------------
    $scope.deleteEnquiryFailure     =   function( data ) 
                                        {
                                            alert("Failed");

                                            var message                             = stripMessageFromAjaxData( data );
                                            $scope.errorMessages                    = [];
                                            $scope.errorMessages.push( message );
                                            $scope.isShowErrorBox_updateEnquiry     = true;
                                            $scope.isShowSuccessBox_updateEnquiry   = false;
                                            housekeeping.isShow_ajaxLoader = false;

                                        } // $scope.updateEnquiryStatusFailure

    $scope.deleteEnquirySuccess     =   function( data ) 
                                        {
                                            $scope.successMessage                   = stripMessageFromAjaxData( data );
                                            $scope.isShowErrorBox_updateEnquiry     = false;
                                            $scope.isShowSuccessBox_updateEnquiry   = true;
                                            housekeeping.isShow_ajaxLoader          = false;

                                            var idxEnquiry = -1;
                                            for( var iEnquiry in $scope.enquiriesToUpdateCollection ) { if( $scope.enquiriesToUpdateCollection[ iEnquiry ].idEnquiry == $scope.selectedEnquiryToUpdate.idEnquiry ) { idxEnquiry = iEnquiry; break; } }
                                            $scope.enquiriesToUpdateCollection.splice( idxEnquiry, 1 );  // remove car from collection
                                            $scope.goBackToEnquiryToUpdateListing();


                                        } // $scope.updateEnquiryStatusSuccess 

    //----------------------------------------------------
    // pagination for enquiry search results
    //

    $scope.paginationCurrentPage    = "1";
    $scope.paginationPageSize       = "10";

    //----------------------------------------------------
    // Date picker
    //
    $scope.formData_updateEnquiry.dateFrom     = "";
    $scope.formData_updateEnquiry.dateTo       = "";

    $scope.dateFormat               = "yyyy-MM-dd";
    $scope.clearDateFrom            = function () { $scope.formData_updateEnquiry.dateFrom = "";    };
    $scope.clearDateTo              = function () { $scope.formData_updateEnquiry.dateTo = "";      };

    $scope.openFromDatePicker       = function($event) 
    {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.fromDatePickerOpened = true;
    };

    $scope.openToDatePicker = function($event) 
    {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.toDatePickerOpened   = true;
    };



    $scope.doTest = function()
    {
        console.log( $scope.dateFrom );
        console.log( $scope.dateTo );

    } // doTest

}); // handleEnquiriesController

//-------------------------------------------------------
// Normal / Non-Angular functions
//-------------------------------------------------------

//-------------------------------------------------------
// updateEnquiryScopeData
//
// Description: copies data from selected record to formData
//-------------------------------------------------------
function updateEnquiryScopeData( $scope, formData, selectedEnquiryToUpdate )
{
    formData.idEnquiry      = selectedEnquiryToUpdate.idEnquiry;
    formData.idUser         = selectedEnquiryToUpdate.idUser;
    formData.dateLodged     = selectedEnquiryToUpdate.dateLodged;
    formData.rego           = selectedEnquiryToUpdate.rego;
    formData.enquiry        = selectedEnquiryToUpdate.enquiry;

    var idxStatusType = 0;
    for( var iStatusType in $scope.statusTypes ) { if( $scope.statusTypes[ iStatusType ].statusType == selectedEnquiryToUpdate.status ) { idxStatusType = iStatusType; break; } }
    formData.selectedStatusType = $scope.statusTypes[ idxStatusType ];

    formData.firstname      = selectedEnquiryToUpdate.firstname;
    formData.lastname       = selectedEnquiryToUpdate.lastname;
    formData.email          = selectedEnquiryToUpdate.email;
    formData.phone          = selectedEnquiryToUpdate.phone;


} // updateUserScopeData


//-------------------------------------------------------
// updateSelectedUserToUpdateRecordFromFormData
//
// Description: copies data from formData to selected record 
//-------------------------------------------------------
function updateSelectedEnquiryToUpdateRecordFromFormData( selectedEnquiryToUpdate, formData )
{
    selectedEnquiryToUpdate.idEnquiry       = formData.idEnquiry;
    selectedEnquiryToUpdate.idUser          = formData.idUser;
    selectedEnquiryToUpdate.dateLodged      = formData.dateLodged;
    selectedEnquiryToUpdate.rego            = formData.rego;
    selectedEnquiryToUpdate.enquiry         = formData.enquiry;
    selectedEnquiryToUpdate.status          = formData.selectedStatusType.statusType;


    selectedEnquiryToUpdate.firstname       = formData.firstname;
    selectedEnquiryToUpdate.lastname        = formData.lastname;
    selectedEnquiryToUpdate.email           = formData.email;
    selectedEnquiryToUpdate.phone           = formData.phone;

} // updateSelectedUserToUpdateRecordFromFormData

