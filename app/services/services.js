//---------------------------------------------------------
//
// services/factories
//
//---------------------------------------------------------
//---------------------------------------------------------
// housekeeping
//---------------------------------------------------------
app.factory('housekeeping', function( $http )
{
    var navMenuItems    =   [   
                                { "href":"#/",              "name":"Home",          "menuItemKey":"home"          },
                                { "href":"#/aboutUs",       "name":"About Us",      "menuItemKey":"aboutUs"       },
                                { "href":"#/ourLocation",   "name":"Our Location",  "menuItemKey":"ourLocation"   },
                                { "href":"#/signIn/0",      "name":"Sign In",       "menuItemKey":"signIn"        } 
                            ];

    var user            =   { 
                                idUser      : '',
                                userType    : -1,
                                firstname   : '',
                                lastname    : '',
                                phone       : '',
                                email       : '',
                                password    : '',
                                isLoggedIn  : false
                            };

                            
    var doRegister      =   function( $scope, housekeeping)
                            {
                                housekeeping.isShow_ajaxLoader = true;

                                var url             = "ajaxScripts/ajaxUserController.php";
                                var sendData        = "action=register" + 
                                                        "&firstname="   + $scope.firstname   + 
                                                        "&lastname="    + $scope.lastname    +
                                                        "&email="       + $scope.email       + 
                                                        "&phone="       + $scope.phone       +
                                                        "&userType="    + $scope.userType    +
                                                        "&password="    + $scope.password;


                                var responsePromise = $http(
                                {
                                    method: 'POST',
                                    url:    url,
                                    data:   sendData,
                                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        
                                })
                                .success( function(data, status, headers, config) 
                                {
                                    housekeeping.isShow_ajaxLoader = false;
                                    if( stripStatusFromAjaxData( data ) != 'Success' ) { $scope.doRegisterFailure( data ); }   
                                    else                                               { $scope.doRegisterSuccess( data ); }

                                })
                                .error( function(data, status, headers, config) 
                                {
                                    housekeeping.isShow_ajaxLoader = false;
                                    alert("AJAX failed for Registering!");
                                });
                                
                            }; // doRegister

    var doSignIn        =   function( $scope, housekeeping )                           
                            {
                                housekeeping.isShow_ajaxLoader = true;

                                var url             = "ajaxScripts/ajaxLoginController.php";
                                var sendData        = "action=sign-in"  + 
                                                        "&email="       + $scope.email       + 
                                                        "&password="    + $scope.password;

                                var responsePromise = $http(
                                {
                                    method: 'POST',
                                    url:    url,
                                    data:   sendData,
                                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        
                                })
                                .success( function(data, status, headers, config) 
                                {
                                    housekeeping.isShow_ajaxLoader = false;
                                    if( stripStatusFromAjaxData( data ) != 'Success' ) { $scope.doSignInFailure( data ); }   
                                    else                                               { $scope.doSignInSuccess( data ); }
                                })
                                .error( function(data, status, headers, config) 
                                {
                                    housekeeping.isShow_ajaxLoader = false;
                                    alert("AJAX failed for Signing In!");
                                });
                                

                            }; // doSignIn

                            
    var doSignOut       =   function( housekeeping ) 
                            {
                                housekeeping.isShow_ajaxLoader = true;

                                var url         = "ajaxScripts/ajaxLoginController.php";
                                var sendData    = "action=signed-out"     + 
                                                    "&idUser="            + housekeeping.user.idUser;  

                                var responsePromise = $http(
                                {
                                    method: 'POST',
                                    url:    url,
                                    data:   sendData,
                                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}       
                                })
                                .success( function(data, status, headers, config) 
                                {
                                    housekeeping.isShow_ajaxLoader = false;

                                    //alert( data );
                                    if( stripStatusFromAjaxData( data ) != 'Success' ) { alert('Error Signing Out'); }   
                                    else                                                
                                    { 
                                        housekeeping.user.isLoggedIn = false;

                                        loadMemberMenu( housekeeping );
                                        displayWelcomeUser(housekeeping );

                                        // redirect to logged out screen
                                        var loc = housekeeping.navMenuItems[0].href;
                                        for( var item in housekeeping.navMenuItems ) { if( housekeeping.navMenuItems[item].menuItemKey == 'signIn' ) { loc = housekeeping.navMenuItems[item].href; } }
                                        window.location = loc;
                                        //$location.path(loc);

                                    }
                                })
                                .error(function(data, status, headers, config) 
                                {
                                    housekeeping.isShow_ajaxLoader = false;
                                    alert("AJAX failed for Signing Out!");
                                });
                                
                            }; // doSignOut


                            
    var isUserSignedIn  =   function isUserSignedIn( $scope, housekeeping )
                            {
                                housekeeping.isShow_ajaxLoader = true;

                                var url         = "ajaxScripts/ajaxLoginController.php";
                                var sendData    = "action=is-signed-in"     + 
                                                    "&idUser="              + housekeeping.user.idUser;  

                                var responsePromise = $http(
                                {
                                    method: 'POST',
                                    url:    url,
                                    data:   sendData,
                                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        
                                })
                                .success( function(data, status, headers, config) 
                                {
                                    housekeeping.isShow_ajaxLoader       = false;
                                    if( stripStatusFromAjaxData( data ) != 'Success' ) { $scope.isUserSignedInFailure( data );  }   
                                    else                                               { $scope.isUserSignedInSuccess( data );  }
                                })
                                .error(function(data, status, headers, config) 
                                {
                                    housekeeping.isShow_ajaxLoader = false;
                                    alert("AJAX failed for Checking User Sign-In!");
                                });
                                
                            }; // isUserSignedIn

    return  {
                mainContentHeight       : "700px",
                strWelcomeUser          : "",           
                selectedNavMenuItemKey  : "home",
                navMenuItems            : navMenuItems,
                user                    : user,
                userType                : "",

                doRegister              : doRegister,
                doSignIn                : doSignIn,
                doSignOut               : doSignOut,
                isUserSignedIn          : isUserSignedIn,

                isShow_ajaxLoader       : false
            };

}); // app.factory('housekeeping', function( $http )


//---------------------------------------------------------
//---------------------------------------------------------
// dbCarService
//---------------------------------------------------------
app.factory('dbCarService', function( $http, $upload )
{

    var addCarToListAndSell =   function( $scope, formData )
                                {
                                    var url         = "ajaxScripts/ajaxCarController.php";
                                    var sendData    = "action=add-car-to-list-and-sell"                                      +
                                                        "&modelID="             + formData.selectedModel.idModel             +
                                                        "&year="                + formData.year                              +
                                                        "&price="               + formData.price                             +
                                                        "&transmission="        + formData.selectedTransmission.transmission +
                                                        "&fuelType="            + formData.selectedFuelType.fuelType         +
                                                        "&driveType="           + formData.selectedDriveType.driveType       +
                                                        "&cylinders="           + formData.cylinders                         +
                                                        "&kilometres="          + formData.kilometres                        +
                                                        "&engineSizeCCs="       + formData.engineSizeCCs                     +
                                                        "&powerkW="             + formData.powerkW                           +
                                                        "&bodyType="            + formData.selectedBodyType.bodyType         +
                                                        "&seats="               + formData.seats                             +
                                                        "&colourInterior="      + formData.colourInterior                    +
                                                        "&colourExterior="      + formData.colourExterior                    +
                                                        "&doors="               + formData.selectedNumDoors.numDoors         +
                                                        "&isNewCar="            + formData.isNewCar                          +
                                                        "&rego="                + formData.rego                              +
                                                        "&VIN="                 + formData.VIN                               ;


                                    var responsePromise = $http(
                                    {
                                        method: 'POST',
                                        url:    url,
                                        data:   sendData,
                                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        
                                    })
                                    .success( function(data, status, headers, config) 
                                    {
                                        if( stripStatusFromAjaxData( data ) != 'Success' ) { $scope.addCarToListAndSellFailure( data );  }   
                                        else                                               { $scope.addCarToListAndSellSuccess( data );  }
                                    })
                                    .error(function(data, status, headers, config) 
                                    {
                                        alert("AJAX failed for Addition of Car!");
                                        $scope.addCarToListAndSellFailure( data );
                                    });

                                } // addCarToListAndSell


    var updateCar           =   function( $scope, formData )
                                {
                                    var url         = "ajaxScripts/ajaxCarController.php";
                                    var sendData    = "action=update-car"                                                    +
                                                        "&modelID="             + formData.selectedModel.idModel             +
                                                        "&year="                + formData.year                              +
                                                        "&price="               + formData.price                             +
                                                        "&transmission="        + formData.selectedTransmission.transmission +
                                                        "&fuelType="            + formData.selectedFuelType.fuelType         +
                                                        "&driveType="           + formData.selectedDriveType.driveType       +
                                                        "&cylinders="           + formData.cylinders                         +
                                                        "&kilometres="          + formData.kilometres                        +
                                                        "&engineSizeCCs="       + formData.engineSizeCCs                     +
                                                        "&powerkW="             + formData.powerkW                           +
                                                        "&bodyType="            + formData.selectedBodyType.bodyType         +
                                                        "&seats="               + formData.seats                             +
                                                        "&colourInterior="      + formData.colourInterior                    +
                                                        "&colourExterior="      + formData.colourExterior                    +
                                                        "&doors="               + formData.selectedNumDoors.numDoors         +
                                                        "&isNewCar="            + formData.isNewCar                          +
                                                        "&rego="                + formData.rego                              +
                                                        "&VIN="                 + formData.VIN                               +
                                                        "&purchaseStatus="      + formData.purchaseStatus                    +
                                                        "&photoID="             + formData.photoID                           +
                                                        "&idCar="               + formData.idCar                             ;

                                    var responsePromise = $http(
                                    {
                                        method: 'POST',
                                        url:    url,
                                        data:   sendData,
                                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}       
                                    })
                                    .success( function(data, status, headers, config) 
                                    {
                                        if( stripStatusFromAjaxData( data ) != 'Success' ) { $scope.updateCarFailure( data );  }   
                                        else                                               
                                        { 
                                            $scope.updateCarSuccess( data );
                                            updateCarPhotos( $scope, formData );
                                        }
                                    })
                                    .error(function(data, status, headers, config) 
                                    {
                                        alert("AJAX failed for Updating of Car!");
                                        $scope.updateCarFailure( data ); 
                                    });


                                } // updateCar


    var deleteCar           =   function( $scope, formData )
                                {
                                    var url         = "ajaxScripts/ajaxCarController.php";
                                    var sendData    = "action=delete-car"                                                    +
                                                        "&idCar="               + formData.idCar                             ;

                                    var responsePromise = $http(
                                    {
                                        method: 'POST',
                                        url:    url,
                                        data:   sendData,
                                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        
                                    })
                                    .success( function(data, status, headers, config) 
                                    {
                                        if( stripStatusFromAjaxData( data ) != 'Success' ) { $scope.deleteCarFailure( data );  }   
                                        else                                               { $scope.deleteCarSuccess( data );  }
                                    })
                                    .error(function(data, status, headers, config) 
                                    {
                                        alert("AJAX failed for Deletion of Car!");
                                        $scope.deleteCarFailure( data );
                                    });


                                } // deleteCar

    //-----------------------------------------------------------
    // Car Photos
    //-----------------------------------------------------------

    var getCarPhotos =  function( $scope, idCarForPhoto )
                        {
                            //alert( "getCarPhotos" );
                            var url         =   "ajaxScripts/ajaxCarPhotoController.php";
                            var sendData    =   "action=get-photos"        +
                                                   "&idCar="               + idCarForPhoto;
                                                   
                            var responsePromise = $http(
                            {
                                method  : 'POST',
                                url     :  url,
                                data    :  sendData,
                                headers : {'Content-Type': 'application/x-www-form-urlencoded'}
                            })
                            .success( function(data, status, headers, config) 
                            {
                                if( stripStatusFromAjaxData( data ) != 'Success' ) { $scope.getCarPhotosFailure( data );  }   
                                else                                               { $scope.getCarPhotosSuccess( data );  }
                            })
                            .error(function(data, status, headers, config) 
                            {
                                alert("AJAX failed for Retrieving of Photos!");
                                $scope.getCarPhotosFailure( data );
                            });


                        } // getCarPhotos



    //---------------------------------------------------------
    // updateCarPhotos - this also includes the delete as well
    //
    function updateCarPhotos( $scope, formData )
    {
        var nCarsUpdating   = 0;
        var nFilesUpdated   = 0; 
        var nFailures       = 0;
        var url             = "ajaxScripts/ajaxCarPhotoController.php";


        for( var iFile in $scope.photoFiles )
        {
            if( typeof $scope.photoFiles[ iFile ].action != 'undefined' )
            {
                nCarsUpdating++;

                var isPrimary   =  ( ( typeof $scope.photoFiles[ iFile ].isPrimary != 'undefined' ) && $scope.photoFiles[ iFile ].isPrimary )? "true" : "false";

                var file        =  $scope.photoFiles[ iFile ].file;
                var sendData    =  { 
                                        action      : $scope.photoFiles[ iFile ].action,
                                        idCar       : $scope.photoFiles[ iFile ].idCar,       
                                        idPhoto     : $scope.photoFiles[ iFile ].idPhoto,
                                        isPrimary   : isPrimary
                                    }  

                $scope.upload = $upload.upload( 
                {
                    method  : 'POST',
                    url     : url, 
                    file    : file,
                    data    : sendData
                })
                .success( function(data, status, headers, config) 
                {
                    if( stripStatusFromAjaxData( data ) != 'Success' ) { nFailures++ }   

                    nFilesUpdated++;
                    if( nFilesUpdated >= nCarsUpdating )  // nCarsUpdating here would theoretically be already updated within the for loop and be in front of the asycnchronous callback of the upload promise
                    {
                        if( nFailures > 0 ) { $scope.updateCarPhotosFailure( data ) } 
                        else                { $scope.updateCarPhotosSuccess( data ) }
                    }
                })
                .error(function(data, status, headers, config) 
                {
                    alert("AJAX failed for Updating of Photos!");
                    $scope.updateCarPhotosFailure( data );
                });
            }
        }

        if( nCarsUpdating == 0 ) { $scope.updateCarPhotosSuccess( "" ); }   // call the $scope's updateCarPhotosSuccess since there was no car photos to update

    } // updateCarPhotos


    //-----------------------------------------------------------
    // New Make & Model
    //-----------------------------------------------------------
    var getAllMakeModels =  function( $scope )
                            {
                                //alert("In getAllMakeModels");

                                var url         = "ajaxScripts/ajaxCarController.php";
                                var sendData    = "action=get-all-makes-models";
                                  

                                var responsePromise = $http(
                                {
                                    method: 'POST',
                                    url:    url,
                                    data:   sendData,
                                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        
                                })
                                .success( function(data, status, headers, config) 
                                {
                                    if( stripStatusFromAjaxData( data ) != 'Success' ) { $scope.getAllMakeModelsFailure( data );  }   
                                    else                                               { $scope.getAllMakeModelsSuccess( data );  }
                                })
                                .error(function(data, status, headers, config) 
                                {
                                    alert("AJAX failed for Getting Make & Models!");
                                    $scope.getAllMakeModelsFailure( data );
                                });

                            } // getAllMakeModels

    //-----------------------------------------------------------
    // Makes
    //-----------------------------------------------------------

    var addMake =           function( $scope, newMake )
                            {
                                var url         = "ajaxScripts/ajaxCarController.php";
                                var sendData    = "action=add-make"     + 
                                                    "&make="            + newMake;  
                                  

                                var responsePromise = $http(
                                {
                                    method: 'POST',
                                    url:    url,
                                    data:   sendData,
                                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        
                                })
                                .success( function(data, status, headers, config) 
                                {
                                    if( stripStatusFromAjaxData( data ) != 'Success' ) { $scope.addMakeFailure( data );  }   
                                    else                                               { $scope.addMakeSuccess( data );  }
                                })
                                .error(function(data, status, headers, config) 
                                {
                                    alert("AJAX failed for Addition of Car Make!");
                                    $scope.addMakeFailure( data );
                                });

                            } // addMake

    var updateMake =        function( $scope, idMake, newMake )
                            {
                                //alert( 'idMake=' + idMake + ' :newMake=' + newMake );

                                var url         = "ajaxScripts/ajaxCarController.php";
                                var sendData    = "action=update-make"      + 
                                                    "&idMake="              + idMake    +
                                                    "&make="                + newMake;  
                                                                                     

                                var responsePromise = $http(
                                {
                                    method: 'POST',
                                    url:    url,
                                    data:   sendData,
                                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        
                                })
                                .success( function(data, status, headers, config) 
                                {
                                    if( stripStatusFromAjaxData( data ) != 'Success' ) { $scope.updateMakeFailure( data );  }   
                                    else                                               { $scope.updateMakeSuccess( data );  }
                                })
                                .error(function(data, status, headers, config) 
                                {
                                    alert("AJAX failed for Updating of Car Make!");
                                    $scope.updateMakeFailure( data );
                                });

                            } // updateMake

    var deleteMake =        function( $scope, idMake )
                            {
                                var url         = "ajaxScripts/ajaxCarController.php";
                                var sendData    = "action=delete-make"      + 
                                                    "&idMake="              + idMake;  
                                                                                     

                                var responsePromise = $http(
                                {
                                    method: 'POST',
                                    url:    url,
                                    data:   sendData,
                                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        
                                })
                                .success( function(data, status, headers, config) 
                                {
                                    if( stripStatusFromAjaxData( data ) != 'Success' ) { $scope.deleteMakeFailure( data );  }   
                                    else                                               { $scope.deleteMakeSuccess( data );  }
                                })
                                .error(function(data, status, headers, config) 
                                {
                                    alert("AJAX failed for Deletion of Car Make!");
                                    $scope.deleteMakeFailure( data );
                                });

                            } // deleteMake


    //-----------------------------------------------------------
    // Models
    //-----------------------------------------------------------

    var addModel =          function( $scope, idMake, newModel )
                            {
                                var url         = "ajaxScripts/ajaxCarController.php";
                                var sendData    = "action=add-model"    + 
                                                    "&idMake="          + idMake       +  
                                                    "&model="           + newModel;
                                  

                                var responsePromise = $http(
                                {
                                    method: 'POST',
                                    url:    url,
                                    data:   sendData,
                                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        
                                })
                                .success( function(data, status, headers, config) 
                                {
                                    if( stripStatusFromAjaxData( data ) != 'Success' ) { $scope.addModelFailure( data );  }   
                                    else                                               { $scope.addModelSuccess( data );  }
                                })
                                .error(function(data, status, headers, config) 
                                {
                                    alert("AJAX failed for Addition of Model!");
                                    $scope.addModelFailure( data );
                                });

                            } // addModel

    var updateModel =       function( $scope, idModel, newModel )
                            {
                                //alert( 'idMake=' + idMake + ' :newMake=' + newMake );

                                var url         = "ajaxScripts/ajaxCarController.php";
                                var sendData    = "action=update-model"     + 
                                                    "&idModel="             + idModel    +
                                                    "&model="               + newModel;  
                                                                                     

                                var responsePromise = $http(
                                {
                                    method: 'POST',
                                    url:    url,
                                    data:   sendData,
                                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        
                                })
                                .success( function(data, status, headers, config) 
                                {
                                    if( stripStatusFromAjaxData( data ) != 'Success' ) { $scope.updateModelFailure( data );  }   
                                    else                                               { $scope.updateModelSuccess( data );  }
                                })
                                .error(function(data, status, headers, config) 
                                {
                                    alert("AJAX failed for Updating of Model!");
                                    $scope.updateModelFailure( data );
                                });

                            } // updateModel

    var deleteModel =       function( $scope, idModel )
                            {
                                var url         = "ajaxScripts/ajaxCarController.php";
                                var sendData    = "action=delete-model"     + 
                                                    "&idModel="             + idModel;  
                                                                                     

                                var responsePromise = $http(
                                {
                                    method: 'POST',
                                    url:    url,
                                    data:   sendData,
                                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        
                                })
                                .success( function(data, status, headers, config) 
                                {
                                    if( stripStatusFromAjaxData( data ) != 'Success' ) { $scope.deleteMakeFailure( data );  }   
                                    else                                               { $scope.deleteMakeSuccess( data );  }
                                })
                                .error(function(data, status, headers, config) 
                                {
                                    alert("AJAX failed for Deletion of Model!");
                                    $scope.deleteMakeFailure( data );
                                });

                            } // deleteModel

    var getCarToUpdate  =   function( $scope, formData )
                            {
                                var url         = "ajaxScripts/ajaxCarController.php";
                                var sendData    = "action=get-car-to-update"    + 
                                                    "&rego="                    + formData.rego   +
                                                    "&VIN="                     + formData.VIN;  
                                                                                     

                                var responsePromise = $http(
                                {
                                    method: 'POST',
                                    url:    url,
                                    data:   sendData,
                                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        
                                })
                                .success( function(data, status, headers, config) 
                                {
                                    if( stripStatusFromAjaxData( data ) != 'Success' ) { $scope.getCarToUpdateFailure( data );  }   
                                    else                                               { $scope.getCarToUpdateSuccess( data );  }
                                })
                                .error(function(data, status, headers, config) 
                                {
                                    alert("AJAX failed for Getting Car to Update!");
                                    $scope.getCarToUpdateFailure( data );
                                });

                            } // getCarToUpdate 


var searchForCar        =   function( $scope, formData )
                            {
                                var url         = "ajaxScripts/ajaxCarController.php";
                                var sendData    = "action=search-for-car"                                                   +
                                                    "&isNewCarType="        + formData.isNewCarType                         +
                                                    "&idMake="              + formData.selectedMakeModels.idMake            +
                                                    "&idModel="             + formData.selectedModel.idModel                +
                                                    "&fromYear="            + formData.fromYear                             +
                                                    "&toYear="              + formData.toYear                               +
                                                    "&fromPrice="           + formData.fromPrice.amount                     +
                                                    "&toPrice="             + formData.toPrice.amount                       ;//+
                                                    /*
                                                    "&transmission="        + formData.selectedTransmission.transmission    +
                                                    "&fuelType="            + formData.selectedFuelType.fuelType            +
                                                    "&driveType="           + formData.selectedDriveType.driveType          +
                                                    "&fromCylinders="       + formData.fromCylinders                        +
                                                    "&toCylinders="         + formData.toCylinders                          +
                                                    "&fromKilometres="      + formData.fromKilometres                       +
                                                    "&toKilometres="        + formData.toKilometres                         +
                                                    "&fromEngineSizeCCs="   + formData.fromEngineSizeCCs                    +
                                                    "&toEngineSizeCCs="     + formData.toEngineSizeCCs                      +
                                                    "&fromPowerkW="         + formData.fromPowerkW                          +
                                                    "&toPowerkW="           + formData.toPowerkW                            +
                                                    "&bodyType="            + formData.selectedBodyType.bodyType            +
                                                    "&fromSeats="           + formData.fromSeats                            +
                                                    "&toSeats="             + formData.toSeats                              +
                                                    "&colourInterior="      + formData.colourInterior                       +
                                                    "&colourExterior="      + formData.colourExterior                       +
                                                    "&fromDoors="           + formData.fromNumDoors.numDoors                +
                                                    "&toDoors="             + formData.toNumDoors.numDoors                  +
                                                    "&rego="                + formData.rego                                 +
                                                    "&VIN="                 + formData.VIN                                  +
                                                    "&purchaseStatus="      + formData.purchaseStatus                       ;
                                                    */

                                var responsePromise = $http(
                                {
                                    method: 'POST',
                                    url:    url,
                                    data:   sendData,
                                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        
                                })
                                .success( function(data, status, headers, config) 
                                {
                                    if( stripStatusFromAjaxData( data ) != 'Success' ) { $scope.searchForCarFailure( data );  }   
                                    else                                               { $scope.searchForCarSuccess( data );  }
                                })
                                .error(function(data, status, headers, config) 
                                {
                                    alert("AJAX failed for Searching Car!");
                                    $scope.searchForCarFailure( data );
                                });


                            } // searchForCar


    return  {
                getAllMakeModels        : getAllMakeModels,
                getCarToUpdate          : getCarToUpdate,

                addModel                : addModel,
                updateModel             : updateModel,
                deleteModel             : deleteModel,

                addCarToListAndSell     : addCarToListAndSell,
                updateCar               : updateCar,
                deleteCar               : deleteCar,

                getCarPhotos            : getCarPhotos,

                addMake                 : addMake,
                updateMake              : updateMake,
                deleteMake              : deleteMake,

                searchForCar            : searchForCar
            };

}); // app.factory('dbCarService', function( $http )


//---------------------------------------------------------
//---------------------------------------------------------
// dbUserService
//---------------------------------------------------------
app.factory('dbUserService', function( $http )
{

    var getUserToUpdate             =   function( $scope, formData )
                                        {

                                            var url             = "ajaxScripts/ajaxUserController.php";
                                            var sendData        = "action=get-user-to-update" + 
                                                                    "&firstname="   + formData.firstname   + 
                                                                    "&lastname="    + formData.lastname    +
                                                                    "&email="       + formData.email       + 
                                                                    "&phone="       + formData.phone       +
                                                                    "&userType="    + formData.userType;

                                            var responsePromise = $http(
                                            {
                                                method: 'POST',
                                                url:    url,
                                                data:   sendData,
                                                headers: {'Content-Type': 'application/x-www-form-urlencoded'}       
                                            })
                                            .success( function(data, status, headers, config) 
                                            {
                                                if( stripStatusFromAjaxData( data ) != 'Success' ) { $scope.getUserToUpdateFailure( data ); }   
                                                else                                               { $scope.getUserToUpdateSuccess( data ); }

                                            })
                                            .error( function(data, status, headers, config) 
                                            {
                                                alert("AJAX failed for Registering!");
                                            });

                                        }; // getUserToUpdate


    var addUser                     =   function( $scope, formData )
                                        {

                                            var url             = "ajaxScripts/ajaxUserController.php";
                                            var sendData        = "action=register" + 
                                                                    "&firstname="   + formData.firstname   + 
                                                                    "&lastname="    + formData.lastname    +
                                                                    "&email="       + formData.email       + 
                                                                    "&phone="       + formData.phone       +
                                                                    "&userType="    + formData.userType    +
                                                                    "&password="    + formData.password;

                                            var responsePromise = $http(
                                            {
                                                method: 'POST',
                                                url:    url,
                                                data:   sendData,
                                                headers: {'Content-Type': 'application/x-www-form-urlencoded'}       
                                            })
                                            .success( function(data, status, headers, config) 
                                            {
                                                if( stripStatusFromAjaxData( data ) != 'Success' ) { $scope.addUserFailure( data ); }   
                                                else                                               { $scope.addUserSuccess( data ); }

                                            })
                                            .error( function(data, status, headers, config) 
                                            {
                                                alert("AJAX failed for Registering!");
                                            });
                               
                                        }; // addUser

    var updateUserPersonalDetails   =   function( $scope, formData )
                                        {
                                            var url             = "ajaxScripts/ajaxUserController.php";
                                            var sendData        = "action=update-user-personal-details" + 
                                                                    "&idUser="      + formData.idUser   +
                                                                    "&firstname="   + formData.firstname   + 
                                                                    "&lastname="    + formData.lastname    +
                                                                    "&email="       + formData.email       + 
                                                                    "&phone="       + formData.phone       +
                                                                    "&userType="    + formData.userType;

                                            var responsePromise = $http(
                                            {
                                                method: 'POST',
                                                url:    url,
                                                data:   sendData,
                                                headers: {'Content-Type': 'application/x-www-form-urlencoded'}       
                                            })
                                            .success( function(data, status, headers, config) 
                                            {
                                                if( stripStatusFromAjaxData( data ) != 'Success' ) { $scope.updateUserPersonalDetailsFailure( data ); }   
                                                else                                               { $scope.updateUserPersonalDetailsSuccess( data ); }

                                            })
                                            .error( function(data, status, headers, config) 
                                            {
                                                alert("AJAX failed for Registering!");
                                            });
                               
                                        }; // updateUserPersonalDetails

    var updateUserPassword          =   function( $scope, formData )
                                        {

                                            var url             = "ajaxScripts/ajaxUserController.php";
                                            var sendData        = "action=update-user-password"             + 
                                                                    "&idUser="      + formData.idUser       +
                                                                    "&oldPassword=" + formData.oldPassword  +
                                                                    "&newPassword=" + formData.newPassword;

                                            var responsePromise = $http(
                                            {
                                                method: 'POST',
                                                url:    url,
                                                data:   sendData,
                                                headers: {'Content-Type': 'application/x-www-form-urlencoded'}       
                                            })
                                            .success( function(data, status, headers, config) 
                                            {
                                                if( stripStatusFromAjaxData( data ) != 'Success' ) { $scope.updateUserPasswordFailure( data ); }   
                                                else                                               { $scope.updateUserPasswordSuccess( data ); }

                                            })
                                            .error( function(data, status, headers, config) 
                                            {
                                                alert("AJAX failed for Registering!");
                                            });
                                
                                        }; // updateUserPassword


    var deleteUser                  =   function( $scope, formData )
                                        {
                                            var url             = "ajaxScripts/ajaxUserController.php";
                                            var sendData        = "action=delete-user" + 
                                                                    "&idUser="      + formData.idUser;

                                            var responsePromise = $http(
                                            {
                                                method: 'POST',
                                                url:    url,
                                                data:   sendData,
                                                headers: {'Content-Type': 'application/x-www-form-urlencoded'}       
                                            })
                                            .success( function(data, status, headers, config) 
                                            {
                                                if( stripStatusFromAjaxData( data ) != 'Success' ) { $scope.deleteUserFailure( data ); }   
                                                else                                               { $scope.deleteUserSuccess( data ); }

                                            })
                                            .error( function(data, status, headers, config) 
                                            {
                                                alert("AJAX failed for Registering!");
                                            });
                               
                                        }; // updateUserPersonalDetails


    return  {
                getUserToUpdate             : getUserToUpdate,
                addUser                     : addUser,
                updateUserPassword          : updateUserPassword,
                updateUserPersonalDetails   : updateUserPersonalDetails,
                deleteUser                  : deleteUser
            };



}); // app.factory('dbUserService', function( $http )



//---------------------------------------------------------
//---------------------------------------------------------
// dbEnquiryService
//---------------------------------------------------------
app.factory('dbEnquiryService', function( $http )
{
    function getEnquiryToUpdate( $scope, formData )
    {
        var dateFrom        = ( ( formData.dateFrom == "" ) || ( formData.dateFrom == null ) )? "" : formData.dateFrom.toJSON();
        var dateTo          = ( ( formData.dateTo == "" ) || ( formData.dateTo == null ) )? "" : formData.dateTo.toJSON();

//
//        console.log( dateFrom );
//        console.log( dateTo );

        var url             = "ajaxScripts/ajaxEnquiriesController.php";
        var sendData        = "action=get-enquiries"    + 
                                "&firstname="           + formData.firstname    +
                                "&lastname="            + formData.lastname     +
                                "&email="               + formData.email        +
                                "&phone="               + formData.phone        +
                                "&dateFrom="            + dateFrom +
                                "&dateTo="              + dateTo;

        var responsePromise = $http(
        {
            method: 'POST',
            url:    url,
            data:   sendData,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}       
        })
        .success( function(data, status, headers, config) 
        {
            if( stripStatusFromAjaxData( data ) != 'Success' ) { $scope.getEnquiryToUpdateFailure( data ); }   
            else                                               { $scope.getEnquiryToUpdateSuccess( data ); }

        })
        .error( function(data, status, headers, config) 
        {
            alert("AJAX failed for Registering!");
        });

    } // getEnquiryToUpdate


    //---------------------------------------------------------
    function lodgeEnquiry( $scope, formData )
    {
        var url             = "ajaxScripts/ajaxEnquiriesController.php";
        var sendData        = "action=lodge-enquiry" + 
                                "&idUser="      + formData.idUser   +
                                "&rego="        + formData.rego     +
                                "&enquiry="     + formData.enquiry;

        var responsePromise = $http(
        {
            method: 'POST',
            url:    url,
            data:   sendData,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}       
        })
        .success( function(data, status, headers, config) 
        {
            if( stripStatusFromAjaxData( data ) != 'Success' ) { $scope.lodgeEnquiryFailure( data ); }   
            else                                               { $scope.lodgeEnquirySuccess( data ); }

        })
        .error( function(data, status, headers, config) 
        {
            alert("AJAX failed for Registering!");
        });
                               

    } // lodgeEnquiry


    //---------------------------------------------------------
    function updateEnquiryStatus( $scope, formData )
    {
        var url             = "ajaxScripts/ajaxEnquiriesController.php";
        var sendData        = "action=update-enquiry-status"    + 
                                "&idEnquiry="                   + formData.idEnquiry        +
                                "&newStatus="                   + formData.selectedStatusType.statusType;

        var responsePromise = $http(
        {
            method: 'POST',
            url:    url,
            data:   sendData,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}       
        })
        .success( function(data, status, headers, config) 
        {
            if( stripStatusFromAjaxData( data ) != 'Success' ) { $scope.updateEnquiryStatusFailure( data ); }   
            else                                               { $scope.updateEnquiryStatusSuccess( data ); }

        })
        .error( function(data, status, headers, config) 
        {
            alert("AJAX failed for Registering!");
        });
                               

    } // updateEnquiryStatus


    //---------------------------------------------------------
    function deleteEnquiry( $scope, formData )
    {
        var url             = "ajaxScripts/ajaxEnquiriesController.php";
        var sendData        = "action=delete-enquiry"    + 
                                "&idEnquiry="                   + formData.idEnquiry;

        var responsePromise = $http(
        {
            method: 'POST',
            url:    url,
            data:   sendData,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}       
        })
        .success( function(data, status, headers, config) 
        {
            if( stripStatusFromAjaxData( data ) != 'Success' ) { $scope.deleteEnquiryFailure( data ); }   
            else                                               { $scope.deleteEnquirySuccess( data ); }

        })
        .error( function(data, status, headers, config) 
        {
            alert("AJAX failed for Registering!");
        });
                               

    } // deleteEnquiry



    //---------------------------------------------------------

    return  {
                getEnquiryToUpdate  : getEnquiryToUpdate,
                lodgeEnquiry        : lodgeEnquiry,
                updateEnquiryStatus : updateEnquiryStatus,
                deleteEnquiry       : deleteEnquiry
            };




}); // app.factory('dbEnquiryService', function( $http )