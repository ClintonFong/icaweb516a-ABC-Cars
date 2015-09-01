//----------------------------------------------------
//
// controllers
//
//----------------------------------------------------
//----------------------------------------------------
//-------mainController ------------------------------
//----------------------------------------------------
app.controller('mainController', function( $scope, housekeeping )
{
    $scope.housekeeping = housekeeping;

    $scope.email        = "";
    $scope.password     = "";


    // ------------------------------------------------------
    // doSignIn
    //
    $scope.strMessage       =   '';
    
    $scope.doSignIn         =   function() 
    { 
        housekeeping.doSignIn( $scope, housekeeping ); 
    }

    // callback function from housekeeping
    //
    $scope.doSignInFailure  =   function( data ) 
                                { 
                                    // redirect to log in screen
                                    var loc = '';
                                    for( var item in housekeeping.navMenuItems )    { if( housekeeping.navMenuItems[item].menuItemKey == 'signIn' ) { loc = housekeeping.navMenuItems[item].href; } }
                                    if( loc != '' ) 
                                    {
                                        window.location = loc.replace( '/0', '/2' ); // tell signIn controller that there is an error
                                        //$location.path( loc.replace( '/0', '/2' ) ); 
                                    }

                                } // doSignInFailure

    $scope.doSignInSuccess  =   function( data ) { doSignIn( $scope, housekeeping, data ); } 
    

    // ------------------------------------------------------
    // Slides
    //
    $scope.slideInterval = 5000;
    $scope.slides = [   { image : 'images/banner1.png', text: '' },
                        { image : 'images/banner2.png', text: '' },
                        { image : 'images/banner3.png', text: '' }     ];


}); // mainController

//----------------------------------------------------
//-------homeController ------------------------------
//----------------------------------------------------
app.controller('homeController', function( $scope, housekeeping, dbCarService, Lightbox )
{
    housekeeping.selectedNavMenuItemKey = 'home'; 
    housekeeping.mainContentHeight      = '900px';

    if( housekeeping.user.isLoggedIn )  { displayWelcomeUser( housekeeping ); }

    //----------------------------------------------------
    // Search Car (Simple)
    //

    $scope.makeModelsCollection                     = [ { idMake            : "",
                                                          make              : "",   
                                                          models            : [] } ]; 

    $scope.carPrices                                = [ { amount : "",       display : ""          },
                                                        { amount : "100",    display : "$100"      },
                                                        { amount : "500",    display : "$500"      },
                                                        { amount : "1000",   display : "$1,000"    },
                                                        { amount : "2000",   display : "$2,000"    },
                                                        { amount : "3000",   display : "$3,000"    },
                                                        { amount : "5000",   display : "$5,000"    },
                                                        { amount : "10000",  display : "$10,000"   },
                                                        { amount : "15000",  display : "$15,000"   },
                                                        { amount : "20000",  display : "$20,000"   },
                                                        { amount : "50000",  display : "$50,000"   },
                                                        { amount : "100000", display : "$100,000"  } ];

    $scope.formData_searchCar                       = {};
    $scope.formData_searchCar.selectedMakeModels    = "";    //$scope.makeModelsCollection[0];
    $scope.formData_searchCar.selectedModel         = "";    //( $scope.makeModelsCollection.length > 0 )? $scope.formData_searchCar.selectedMakeModels.models[0] : '';
    $scope.formData_searchCar.fromPrice             = $scope.carPrices[0];
    $scope.formData_searchCar.toPrice               = $scope.carPrices[0];
    $scope.formData_searchCar.fromYear              = "";
    $scope.formData_searchCar.toYear                = "";
    $scope.formData_searchCar.transmission          = "";
    $scope.formData_searchCar.fuelType              = "";
    $scope.formData_searchCar.driveType             = "";
    $scope.formData_searchCar.fromCylinders         = "";
    $scope.formData_searchCar.toCylinders           = "";
    $scope.formData_searchCar.fromKilometres        = "";
    $scope.formData_searchCar.toKilometres          = "";
    $scope.formData_searchCar.fromEngineSizeCCs     = "";
    $scope.formData_searchCar.toEngineSizeCCs       = "";
    $scope.formData_searchCar.fromPowerkW           = "";
    $scope.formData_searchCar.toPowerkW             = "";
    $scope.formData_searchCar.bodyType              = "";
    $scope.formData_searchCar.fromSeats             = "";
    $scope.formData_searchCar.toSeats               = "";
    $scope.formData_searchCar.colourInterior        = "";
    $scope.formData_searchCar.colourExterior        = "";
    $scope.formData_searchCar.fromDoors             = "";
    $scope.formData_searchCar.toDoors               = "";
    $scope.formData_searchCar.isNewCarType          = "all";
    $scope.formData_searchCar.rego                  = "";
    $scope.formData_searchCar.VIN                   = "";
    $scope.formData_searchCar.purchaseStatus        = "";
  
    // search Results
    //$scope.searchForCarResultsCollection            = [ { photoFilename:"", rego:"", VIN:"", make:"", model:"", year:"", price:"" } ];
    $scope.searchForCarResultsCollection            = [];
    $scope.selectedCarToDisplay                     = "";
    $scope.isShow_lookUpCarResults_listing          = false;
    $scope.isShow_lookUpCarResults_detail           = false;

    $scope.formData_searchCarResult                 = {};

    $scope.formData_searchCarResult.make            = "";    
    $scope.formData_searchCarResult.model           = "";    

    $scope.formData_searchCarResult.year            = '';
    $scope.formData_searchCarResult.price           = '';

    $scope.formData_searchCarResult.transmission    = ""
    $scope.formData_searchCarResult.fuelType        = ""
    $scope.formData_searchCarResult.driveType       = ""
    $scope.formData_searchCarResult.cylinders       = "";
    $scope.formData_searchCarResult.kilometres      = "";
    $scope.formData_searchCarResult.engineSizeCCs   = "";
    $scope.formData_searchCarResult.powerkW         = "";

    $scope.formData_searchCarResult.bodyType        = "";
    $scope.formData_searchCarResult.seats           = "";
    $scope.formData_searchCarResult.colourInterior  = "";
    $scope.formData_searchCarResult.colourExterior  = "";
    $scope.formData_searchCarResult.doors           = "";

    $scope.formData_searchCarResult.isNewCar        = false;
    $scope.formData_searchCarResult.rego            = "";
    $scope.formData_searchCarResult.VIN             = "";
    $scope.formData_searchCarResult.idCar           = "";    

    $scope.lightboxImages                           = [];

   //---------------------------------
    dbCarService.getAllMakeModels( $scope );

   //---------------------------------
    $scope.doSearch                 = function()
    {
        dbCarService.searchForCar( $scope, $scope.formData_searchCar );

    } // $scope.doSearch

    //-------------------------------------------------------
    $scope.selectCarFromListing         = function( car )
    {
        $scope.selectedCarToDisplay                     = car; // $scope.searchForCarResultsCollection[ this.$index ];

        housekeeping.mainContentHeight                  = "1200px";
        $scope.isShow_lookUpCarResults_listing          = false;
        $scope.isShow_lookUpCarResults_detail           = true;

        updateCarScopeDisplayData( $scope.formData_searchCarResult, $scope.selectedCarToDisplay );

    } // $scope.selectCarFromListing

    //-------------------------------------------------------
    $scope.goBackToCarToResultListing   = function()
    {
        housekeeping.mainContentHeight                  = "1000px";
        $scope.isShow_lookUpCarResults_listing          = true;
        $scope.isShow_lookUpCarResults_detail           = false;


    } // $scope.goBackToCarToResultListing  

    //-------------------------------------------------------
    $scope.viewPhotos   = function()
    {
        dbCarService.getCarPhotos( $scope, $scope.selectedCarToDisplay.idCar );

    } // viewPhotos

    //-------------------------------------------------------
    // ajax Response Handlers
    //-------------------------------------------------------
    $scope.getAllMakeModelsFailure  =   function( data ) {} 
    $scope.getAllMakeModelsSuccess  =   function( data ) 
                                        { 
                                            $scope.makeModelsCollection                   = $scope.makeModelsCollection.concat( JSON.parse( stripDataFromAjaxData( data )) );
                                            
                                            // add the indexes for view manipulation
                                            for( var iMakeModels in $scope.makeModelsCollection )
                                            {
                                                $scope.makeModelsCollection[ iMakeModels ].idxSelectedModel = 0;

                                                // put blank model at the beginning of array
                                                var blankModel = { model:"",  idModel:""  };
                                                $scope.makeModelsCollection[ iMakeModels ].models.unshift( blankModel );

                                                // add indexes for each model for easier manipulation
                                                for( var iModel in $scope.makeModelsCollection[ iMakeModels ].models )
                                                {
                                                    $scope.makeModelsCollection[ iMakeModels ].models[ iModel ].idx = iModel;
                                                }
                                            }

                                            $scope.formData_searchCar.selectedMakeModels    = $scope.makeModelsCollection[0];
                                            $scope.formData_searchCar.selectedModel         = ( $scope.makeModelsCollection.length > 0 )? $scope.formData_searchCar.selectedMakeModels.models[0] : '';

                                        } // getAllMakeModelsSuccess

    $scope.searchForCarFailure      =   function( data ) {} 
    $scope.searchForCarSuccess      =   function( data ) 
                                        { 
                                            $scope.isShow_lookUpCarResults_listing  = true;
                                            $scope.isShow_lookUpCarResults_detail   = false;
                                            $scope.searchForCarResultsCollection    = JSON.parse( stripDataFromAjaxData( data ));

                                        } // $scope.searchCarSuccess

    $scope.getCarPhotosFailure      =   function( data )  {}   
    $scope.getCarPhotosSuccess      =   function( data )  
                                        {
                                            var carPhotosCollection = JSON.parse( stripDataFromAjaxData( data ));
                                            
                                            if( carPhotosCollection.length > 0 )
                                            { 
                                                // create image array
                                                $scope.lightboxImages = [];     
                                                for( var iPhoto in carPhotosCollection )
                                                {
                                                    var image = { url : carPhotosCollection[ iPhoto ].name };
                                                    $scope.lightboxImages.push( image );
                                                }
                                                Lightbox.openModal( $scope.lightboxImages, 0 );
                                            }
                                            else
                                            {
                                                alert("Sorry, but there are no photos for this car");
                                            }                                            
                                            //console.log( carPhotosCollection );

                                        }   // $scope.getCarPhotosSuccess


    //----------------------------------------------------
    // pagination for car search results
    //

    $scope.paginationCurrentPage    = "1";
    $scope.paginationPageSize       = "5";

     
}); // homeController


//-----------------------------------------------------------
//-------homeManagerController ------------------------------
//-----------------------------------------------------------

app.controller('homeManagerController', function(   $scope, 
                                                    housekeeping, 
                                                    $modal,
                                                    dbCarService )                                                    
{
    housekeeping.selectedNavMenuItemKey = "homeManager"; 


    // ------------------------------------------------------
    // isUserSignedIn
    //
    housekeeping.isUserSignedIn( $scope, housekeeping );    // check if user is signed in
    $scope.isAuthorized             = false;
    $scope.isUserSignedInSuccess    =   function ( data ) 
                                        { 
                                            var user = JSON.parse( stripDataFromAjaxData( data ) );
                                            housekeeping.user.userType      = user.userType; 
                                            if( user.userType < UT_STAFF ) { doThrowUserOut( housekeeping ); }
                                            else
                                            { 
                                                doSignIn( $scope, housekeeping, data );   
                                                $scope.isAuthorized = true;
                                            }
                                            

                                        } // isUserSignedInSuccess

    $scope.isUserSignedInFailure    =   function ( data ) 
                                        { 
                                            housekeeping.user.userType      = UT_CUSTOMER; 
                                            doThrowUserOut( housekeeping );

                                        }  // $scope.isUserSignedInFailure
  
/*
    // check for signed in
    //
    if( !housekeeping.user.isLoggedIn || (housekeeping.user.userType != UT_MANAGER) ) // not signed in or not a manager - log them out 
    { 
        // redirect to log in screen
        var loc = '';
        for( var item in housekeeping.navMenuItems )    { if( housekeeping.navMenuItems[item].menuItemKey == 'signIn' ) { loc = housekeeping.navMenuItems[item].href; } }
        if( loc != '' ) 
        {
            window.location = loc.replace( '/0', '/2' ); // tell signIn controller that there is an error
            //$location.path( loc ); 
        }

    } // check for signed in
*/

    // changing the main-Content height dynamically
    //
    $scope.onTabClickListAndSell        =   function() { housekeeping.mainContentHeight = "1200px"; }
    $scope.onTabClickNewMakeAndModel    =   function() { housekeeping.mainContentHeight = "500px"; }

    //---------------------------------
    // main left menu
    //
    $scope.menuStatus = [   { isOpen : true     },
                            { isOpen : false    }, 
                            { isOpen : false    } ];

                          
    $scope.leftPanelMenuItem            =   { 
                                                addNewCar               : { url : "app/pages/component/addCar.htm" },
                                                updateDeleteCar         : { url : "app/pages/component/updateDeleteCar.htm" },

                                                addNewCustomer          : { url : "app/pages/component/addCustomer.htm" },
                                                updateDeleteCustomer    : { url : "app/pages/component/updateDeleteCustomer.htm" },
                                                enquiries               : { url : "app/pages/component/updateDeleteEnquiries.htm" },

                                                addNewStaff             : { url : "app/pages/component/addStaff.htm" },
                                                updateDeleteStaff       : { url : "app/pages/component/updateDeleteStaff.htm" }
                                            };
    $scope.selectedLeftPanelMenuItemURL = $scope.leftPanelMenuItem.addNewCar.url;

    $scope.changeLeftPanelMenuItem      =   function( page ) 
                                            { 
                                                //alert( page.url );                                    
                                                $scope.selectedLeftPanelMenuItemURL = page.url;

                                            } // changeLeftPanelMenuItem
    


}); // homeManagerController


//-------------------------------------------------------
//-------aboutUsController ------------------------------
//-------------------------------------------------------
app.controller('aboutUsController', function ( $scope, housekeeping )
{
    housekeeping.selectedNavMenuItemKey = 'aboutUs';
    housekeeping.mainContentHeight = "550px";

    //$scope.welcomeMessage   = 'Welcome everyone - this is the About Us controller';

}); // aboutUsController

//-----------------------------------------------------------
//-------ourLocationController ------------------------------
//-----------------------------------------------------------
app.controller('ourLocationController', function (  $scope, housekeeping )
{
    housekeeping.selectedNavMenuItemKey = 'ourLocation';

    housekeeping.mainContentHeight = "550px";
    //$scope.welcomeMessage   = 'Welcome everyone - this is the Our Location controller';

}); // ourLocationController

//---------------------------------------------------------
//-------enquiriesController ------------------------------
//---------------------------------------------------------
app.controller('enquiriesController', function( $scope, 
                                                housekeeping,  
                                                dbEnquiryService )
{
    housekeeping.selectedNavMenuItemKey = 'enquiries';

    // ------------------------------------------------------
    // form variables
    //
    $scope.formData_enquiry         = {};
    $scope.formData_enquiry.idUser  = -1;
    $scope.formData_enquiry.rego    = "";
    $scope.formData_enquiry.enquiry = "";


    // ------------------------------------------------------
    // isUserSignedIn
    //
    housekeeping.isUserSignedIn( $scope, housekeeping );    // check if user is signed in
    $scope.isAuthorized             = false;
    $scope.isUserSignedInSuccess    =   function ( data ) 
                                        { 
                                            var user = JSON.parse( stripDataFromAjaxData( data ) );
                                            housekeeping.user.userType      = user.userType; 
                                            if( user.userType != UT_CUSTOMER )  { doThrowUserOut( housekeeping );   }
                                            else                                
                                            { 
                                                $scope.isAuthorized             = true;       
                                                $scope.formData_enquiry.idUser  = user.idUser;
                                                doSignInStraight( $scope, housekeeping, data );   
                                            } 

                                        } // isUserSignedInSuccess

    $scope.isUserSignedInFailure    =   function ( data ) 
                                        { 
                                            housekeeping.user.userType      = UT_CUSTOMER; 
                                            doThrowUserOut( housekeeping );

                                        }  // $scope.isUserSignedInFailure



    $scope.isShowSuccessBox_enquiry     = false;
    $scope.isShowErrorBox_enquiry       = false;
    $scope.successMessage               = "";
    $scope.errorMessage                 = "";
    $scope.errorLabel                   = ""
    

    $scope.checkSubmitEnquiry       = { isSubmitted: false };

    // ------------------------------------------------------
    $scope.submitEnquiry            = function()
    {
        if( $scope.formData_enquiry.enquiry == "" )
        {
            $scope.errorLabel                       = "Required:";
            $scope.errorMessage                     = "Please fill in the Enquiry field";
            $scope.isShowErrorBox_enquiry           = true;
            $scope.checkSubmitEnquiry.isSubmitted   = true;                           
        }
        else
        {
            $scope.isShowSuccessBox_enquiry     = false;
            $scope.isShowErrorBox_enquiry       = false;
            dbEnquiryService.lodgeEnquiry( $scope, $scope.formData_enquiry );
        }

    } // $scope.submitEnquiry

    //-------------------------------------------------------
    // ajax Response Handlers
    //-------------------------------------------------------
    
    $scope.lodgeEnquiryFailure      =   function( data )
                                        {
                                            $scope.errorLabel                   = "Error:";
                                            $scope.errorMessage                 = "Lodging of enquiry Failed. Please call us instead...";
                                            $scope.isShowSuccessBox_enquiry     = false;
                                            $scope.isShowErrorBox_enquiry       = true;

                                        } // lodgeEnquiryFailure

    $scope.lodgeEnquirySuccess      =   function( data )
                                        {
                                            $scope.successMessage               = "Lodging of enquiry Succeeded. We will be in contact with you shortly.";
                                            $scope.isShowSuccessBox_enquiry     = true;
                                            $scope.isShowErrorBox_enquiry       = false;

                                        } // lodgeEnquirySuccess

}); // enquiriesController

//------------------------------------------------------
//-------signInController ------------------------------
//------------------------------------------------------
app.controller('signInController', function( $scope, housekeeping, $routeParams )
{
    housekeeping.selectedNavMenuItemKey = 'signIn';
    housekeeping.mainContentHeight      = "500px";
    //$scope.user                         = housekeeping.user;


    // ------------------------------------------------------
    // toggle SignIn/Register display
    //
    // bitwise operations: 1 = register, 0 = sign-in
    //
    $scope.isInSignInDisplay    = ( ($routeParams.code & 1) == 1 )? false : true; 
    $scope.toggleSignInDisplay  = function() { $scope.isInSignInDisplay = !$scope.isInSignInDisplay; }

    // ------------------------------------------------------
    $scope.setSignInDisplay     = function() { $scope.isInSignInDisplay = true; }
    $scope.setRegisterDisplay   = function() { $scope.isInSignInDisplay = false; }


    // ------------------------------------------------------
    // doRegister
    //
    $scope.submitRegister       =   { isSubmitted : false };

    $scope.userType             =   UT_CUSTOMER;
    $scope.firstname            =   "";
    $scope.lastname             =   "";
    $scope.phone                =   "";
    $scope.email                =   "";
    $scope.password             =   "";
    $scope.passwordConfirm      =   "";  
    $scope.doRegister           =   function()        
                                    { 
                                        var errorMessage = "";

                                        if( ( typeof $scope.firstname == 'undefined' )  || ( $scope.firstname  == "" ) )    { errorMessage += "Missing firstname\n";        }                                       
                                        if( ( typeof $scope.lastname  == 'undefined' )  || ( $scope.lastname   == "" ) )    { errorMessage += "Missing lastname\n";         }
                                        if( ( typeof $scope.email     == 'undefined' )  || ( $scope.email      == "" ) )    { errorMessage += "Missing email\n";            }
                                        if( !isValidEmail( $scope.email ) )                                                 { errorMessage += "Invalid email\n";            }
                                        if( ( typeof $scope.phone     == 'undefined' )  || ( $scope.phone      == "" ) )    { errorMessage += "Missing phone\n";            }
                                        if( ( typeof $scope.password  == 'undefined' )  || ( $scope.password   == "" ) )    { errorMessage += "Missing password\n";         }
                                        if( !isPasswordSecureEnough( $scope.password ) )                                    { errorMessage += "Password NOT Secure Enough. Must be at least 7 characters, a number, and a letter\n" }
                                        if( $scope.password != $scope.passwordConfirm )                                     { errorMessage += "Passwords do not Match\n";   }

                                        if( errorMessage == "" )                                                            { housekeeping.doRegister( $scope, housekeeping );  }
                                        else
                                        { 
                                            alert( errorMessage ); 
                                            $scope.submitRegister.isSubmitted = true;                           
                                        }
                                    }
    $scope.doRegisterFailure    =   function( data )  { $scope.strMessage = "Register Unsuccessful";        }
    $scope.doRegisterSuccess    =   function( data )  { doSignIn( $scope, housekeeping, data );             } 

    
    // ------------------------------------------------------
    // doSignIn
    //
    // bitwise operations: 10 binary = 2 decimal = error 
    $scope.showErrorBox         =   ( ($routeParams.code & 2) == 2 );
    $scope.strMessage           =   ( $scope.showErrorBox )? 'Login Unsuccessful' : '';

    $scope.submitSignIn         =   { isSubmitted : false }
    $scope.doSignIn             =   function()        
                                    { 
                                        var errorMessage = "";

                                        if( ( typeof $scope.email    == 'undefined' )  || ( $scope.email     == "" ) )  { errorMessage += "Missing email\n";               }                                       
                                        if( ( typeof $scope.password == 'undefined' )  || ( $scope.password  == "" ) )  { errorMessage += "Missing password\n";            }

                                        if( errorMessage == "" )                                                        { housekeeping.doSignIn( $scope, housekeeping );   }
                                        else
                                        {
                                            alert( errorMessage ); 
                                            $scope.submitSignIn.isSubmitted = true;
                                        }

                                    } // $scope.doSignIn

    $scope.doSignInFailure      =   function( data )  { $scope.strMessage = "Login Unsuccessful";         }
    $scope.doSignInSuccess      =   function( data )  { doSignIn( $scope, housekeeping, data );           } 

}); // signInController

//-------------------------------------------------------
//-------signOutController ------------------------------
//-------------------------------------------------------
app.controller('signOutController', function( $scope, housekeeping, $http )
{
    housekeeping.selectedNavMenuItemKey = 'signOut';
    housekeeping.doSignOut( housekeeping );

}); // signOutController

//-------------------------------------------------------
// Dialog Controller
//-------------------------------------------------------
app.controller('dialogConfirmDeletionController', function ($scope, $modalInstance, messageDetails ) 
{
    $scope.title                =   messageDetails.title;
    $scope.message1             =   messageDetails.message1;
    $scope.message1_highlight   =   messageDetails.message1_highlight;
    $scope.message2             =   messageDetails.message2;
    $scope.message2_highlight   =   messageDetails.message2_highlight;

    $scope.no                   =   function () { $modalInstance.dismiss('no'); };
    $scope.yes                  =   function () { $modalInstance.close('yes');  };

}); // dialogConfirmDeletionController


//-------------------------------------------------------
// Normal / Non-Angular functions
//-------------------------------------------------------

//---------------------------------------------------------------------------
// doSignIn
//---------------------------------------------------------------------------
function doSignIn( $scope, housekeeping, data )
{
    doSignInStraight( $scope, housekeeping, data );
    window.location                 = housekeeping.navMenuItems[0].href;
    //$location.path( housekeeping.navMenuItems[0].href );

} // doSignIn

//---------------------------------------------------------------------------
// doSignInStraight
//---------------------------------------------------------------------------
function doSignInStraight( $scope, housekeeping, data )
{
    housekeeping.user.isLoggedIn    = true;

    $scope.strMessage               = stripMessageFromAjaxData(data); 
    $scope.user                     = JSON.parse( stripDataFromAjaxData( data ));

    copyUserDetails( housekeeping.user, $scope.user );
    loadMemberMenu( housekeeping );
    displayWelcomeUser( housekeeping );

} // doSignInStraight


//---------------------------------------------------------------------------
// doThrowUserOut
//---------------------------------------------------------------------------
function doThrowUserOut( housekeeping )
{
    alert( "You are not Authorized to view this page" );
    housekeeping.user.isLoggedIn    = false;
    loadMemberMenu( housekeeping );
    removeWelcomeUser( housekeeping );
    window.location                 = housekeeping.navMenuItems[0].href;
    //$location.path( housekeeping.navMenuItems[0].href );

} // doSignIn

//-------------------------------------------------------
// updateCarScopeDisplayData
//
// Description: copies data from selected record to formData
//-------------------------------------------------------
function updateCarScopeDisplayData( formData, selectedCarToDisplay )
{
    formData.make                       = selectedCarToDisplay.make;
    formData.model                      = selectedCarToDisplay.model;

    formData.year                       = selectedCarToDisplay.year;
    formData.price                      = selectedCarToDisplay.price;

    formData.transmission               = selectedCarToDisplay.transmission;
    formData.fuelType                   = selectedCarToDisplay.fuelType;
    formData.driveType                  = selectedCarToDisplay.driveType;
    formData.cylinders                  = selectedCarToDisplay.cylinders;
    formData.kilometres                 = selectedCarToDisplay.kilometres;
    formData.engineSizeCCs              = selectedCarToDisplay.engineSizeCCs;
    formData.powerkW                    = selectedCarToDisplay.powerkW;

    formData.bodyType                   =  selectedCarToDisplay.bodyType;
    formData.seats                      =  selectedCarToDisplay.seats;
    formData.colourInterior             =  selectedCarToDisplay.colourInterior;
    formData.colourExterior             =  selectedCarToDisplay.colourExterior;
    formData.doors                      =  selectedCarToDisplay.doors;

    formData.isNewCar                   =  selectedCarToDisplay.isNewCar;
    formData.rego                       =  selectedCarToDisplay.rego;
    formData.VIN                        =  selectedCarToDisplay.VIN;

    formData.idCar                      =  selectedCarToDisplay.idCar;

} // updateCarScopeDisplayData


