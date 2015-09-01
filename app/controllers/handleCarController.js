
//-----------------------------------------------------------
//-------updateCarController ------------------------------
//-----------------------------------------------------------
app.controller('handleCarController', function( $scope, 
                                                housekeeping, 
                                                $modal,
                                                dbCarService )
{

    //----------------------------------------------------------------------------------
    //----------------------------------------------------------------------------------
    // Add Car
    //----------------------------------------------------------------------------------

    //---------------------------------
    // To List & Sell Tab
    //

    $scope.transmissions                    = [     { transmission  : "Manual"              }, 
                                                    { transmission  : "Automatic"           }, 
                                                    { transmission  : "CVT"                 }, 
                                                    { transmission  : "Sequential Manual"   }, 
                                                    { transmission  : "Dual/Twin Clutch"    } ];
    $scope.fuelTypes                        = [     { fuelType      : "Unleaded"            },
                                                    { fuelType      : "Premium"             },
                                                    { fuelType      : "E10"                 },
                                                    { fuelType      : "Diesel"              },
                                                    { fuelType      : "LPG"                 } ];
    $scope.driveTypes                       = [     { driveType     : "4x4"                 },
                                                    { driveType     : "4x4 Constant"        },
                                                    { driveType     : "4x4 Dual Range"      },
                                                    { driveType     : "4x4 On Demand"       },
                                                    { driveType     : "Four Wheel Drive"    },
                                                    { driveType     : "Front Wheel Drive"   },
                                                    { driveType     : "Rear Wheel Drive"    } ];
    $scope.bodyTypes                        = [     { bodyType      : "Cab Chassis"         },
                                                    { bodyType      : "Convertible"         },
                                                    { bodyType      : "Coupe"               },
                                                    { bodyType      : "Hatch"               },
                                                    { bodyType      : "Light Truck"         },
                                                    { bodyType      : "People Mover"        },
                                                    { bodyType      : "Sedan"               },
                                                    { bodyType      : "SUV"                 },
                                                    { bodyType      : "Ute"                 },
                                                    { bodyType      : "Van"                 },
                                                    { bodyType      : "Wagon"               } ];
    $scope.doors                            = [     { numDoors      : "2"                   },
                                                    { numDoors      : "3"                   },
                                                    { numDoors      : "4"                   },
                                                    { numDoors      : "5"                   } ];

    $scope.purchaseStatusTypes              = [     { value : PS_AVAILABLE,         display : "Available"       },
                                                    { value : PS_DEPOSIT_PAID,      display : "Deposit Paid"    },
                                                    { value : PS_SOLD,              display : "Sold"            } ];   

    $scope.makeModelsCollection             = [];

/* - test data --
    $scope.makeModelsCollection             = [ {   make                : 'Mazda',   
                                                    idxSelectedModel    : 0,
                                                    models              : [ { model:'Mazda 3',  idx: 0  }, 
                                                                            { model:'Mazda 6',  idx: 1  }, 
                                                                            { model:'RX-7',     idx: 2  }, 
                                                                            { model:'RX-8',     idx: 3  }, 
                                                                            { model:'CX-5',     idx: 4  }, 
                                                                            { model:'CX-9',     idx: 5  } ] },
                                                {   make                : 'Toyota',  
                                                    idxSelectedModel    : 0,
                                                    models              : [ { model:'Corolla',  idx: 0  },
                                                                            { model:'Camry',    idx: 1  }, 
                                                                            { model:'Rav4',     idx: 2  }, 
                                                                            { model:'Yaris',    idx: 3  }, 
                                                                            { model:'Leaf',     idx: 4  }, 
                                                                            { model:'86',       idx: 5  } ] } ];
*/


    //--- formData_addCar ------------------------------
    //

    $scope.isShowErrorBox_addCar                    = false;
    $scope.isShowSuccessBox_addCar                  = false;
    $scope.errorMessages                            = [];
    $scope.successMessage                           = "";

    $scope.formData_addCar                          = {};

    $scope.formData_addCar.selectedMakeModels       = "";    //$scope.makeModelsCollection[0];
    $scope.formData_addCar.selectedModel            = "";    //( $scope.makeModelsCollection.length > 0 )? $scope.formData_addCar.selectedMakeModels.models[0] : '';

    $scope.formData_addCar.year                     = '';
    $scope.formData_addCar.price                    = '';

    $scope.formData_addCar.selectedTransmission     = $scope.transmissions[0];
    $scope.formData_addCar.selectedFuelType         = $scope.fuelTypes[0];
    $scope.formData_addCar.selectedDriveType        = $scope.driveTypes[0];
    $scope.formData_addCar.cylinders                = "";
    $scope.formData_addCar.kilometres               = "";
    $scope.formData_addCar.engineSizeCCs            = "";
    $scope.formData_addCar.powerkW                  = "";

    $scope.formData_addCar.selectedBodyType         =  $scope.bodyTypes[0];
    $scope.formData_addCar.seats                    =  "";
    $scope.formData_addCar.colourInterior           =  "";
    $scope.formData_addCar.colourExterior           =  "";
    $scope.formData_addCar.selectedNumDoors         =  $scope.doors[0];

    $scope.formData_addCar.isNewCar                 =  false;
    $scope.formData_addCar.rego                     =  "";
    $scope.formData_addCar.VIN                      =  "";

    //$scope.imageSrc                                 = "";
    $scope.isShow_enterValues                       = true;
    $scope.isShow_loadedPhoto                       = false;
    //$scope.loadPhotoFilename                        = "";
    $scope.photoFiles                               = [];
    $scope.photoHeight                              = 0;

    //---------------------------------
    dbCarService.getAllMakeModels( $scope );

    // Using formData_addCar so we can update the view from the controller (little quirk in javascript)
    //
    
   

    //---------------------------------
    // Work variables

    var idx_forNewMakeInsertID              = -1;

    var postAjaxUpdate_Models               = [];
    var idx_forNewModelInsertID             = -1;


    //-----------------------------------------------------------
    // To List & Sell Tab

    //-----------------------------------------------------------
    $scope.submitForm_enterValuesListSell   = function()
    {
        if( preDBUpdateCheckEnteredCarValues( $scope.formData_addCar ) )    
        { 
            $scope.isShowErrorBox_addCar        = false;
            $scope.isShowSuccessBox_addCar      = false;
            dbCarService.addCarToListAndSell( $scope, $scope.formData_addCar ); 
        }      
        else                                                                
        {
            $scope.isShowErrorBox_addCar        = true;
            $scope.isShowSuccessBox_addCar      = false;            
        }

    } // $scope.submitForm_enterValuesListSell

    //-------------------------------------------------------
    function preDBUpdateCheckEnteredCarValues( formData ) 
    {
        $scope.errorMessages = [];

        if( (typeof formData.selectedModel == 'undefined')               || (formData.selectedModel == "") || 
            (typeof formData.selectedMakeModels.models == 'undefined')   || (formData.selectedMakeModels.models.length == 0) )
        {
            $scope.errorMessages.push( "You must have a Make & Model selected" );
        }

        if( ( formData.rego == "" ) ||
            ( formData.VIN == "" )  || ( formData.VIN.length < 17 ) )
        {
            $scope.errorMessages.push( "Both Rego & VIN are required. \nAlso VIN must be 17 characters in length" );
        }
        return ( $scope.errorMessages.length == 0 );
        
    } // preDBUpdateCheckEnteredCarValues


    //-----------------------------------------------------------
    $scope.isSubmitForm_enterValuesListSell_disabled    = function()
    {
        var bDisabled = false;

        if( ( $scope.formData_addCar.rego.$pristine           || ( $scope.formData_addCar.rego.$dirty           && $scope.formData_addCar.rego.$invalid )             )   ||
            ( $scope.formData_addCar.VIN.$pristine            || ( $scope.formData_addCar.VIN.$dirty            && $scope.formData_addCar.VIN.$invalid )              )   ||
            ( $scope.formData_addCar.year.$pristine           || ( $scope.formData_addCar.year.$dirty           && $scope.formData_addCar.year.$invalid )             )   ||
            ( $scope.formData_addCar.price.$pristine          || ( $scope.formData_addCar.price.$dirty          && $scope.formData_addCar.price.$invalid )            )   ||
            ( $scope.formData_addCar.cylinders.$pristine      || ( $scope.formData_addCar.cylinders.$dirty      && $scope.formData_addCar.cylinders.$invalid )        )   ||
            ( $scope.formData_addCar.kilometres.$pristine     || ( $scope.formData_addCar.kilometres.$dirty     && $scope.formData_addCar.kilometres.$invalid )       )   ||
            ( $scope.formData_addCar.engineSizeCCs.$pristine  || ( $scope.formData_addCar.engineSizeCCs.$dirty  && $scope.formData_addCar.engineSizeCCs.$invalid )    )   ||
            ( $scope.formData_addCar.powerkW.$pristine        || ( $scope.formData_addCar.powerkW.$dirty        && $scope.formData_addCar.powerkW.$invalid )          )   ||
            ( $scope.formData_addCar.seats.$pristine          || ( $scope.formData_addCar.seats.$dirty          && $scope.formData_addCar.seats.$invalid )            )   ||
            ( $scope.formData_addCar.color.$pristine          || ( $scope.formData_addCar.color.$dirty          && $scope.formData_addCar.color.$invalid )            )    )
        {
            bDisabled = true;
        }

        return bDisabled;

    } // $scope.isSubmitForm_enterValuesListSell_disabled


    //-----------------------------------------------------------
    // New Make & Model Tab

    //-----------------------------------------------------------
    // Make
    //-----------------------------------------------------------
    $scope.addUpdateMakeDialog      = function( updateType, formData_addCar )
    {
        var carUpdateInfo           =   { 
                                            updateType      : updateType,
                                            make            : (updateType == 'new')? '' : formData_addCar.selectedMakeModels.make 
                                        }


        var objAddUpdateMakeDialog  =   $modal.open( 
                                        {
                                            templateUrl :   'enterMakeOfCar.htm',
                                            controller  :   'dialogMakeObjectController',
                                            windowClass :   'dialogAddUpdateMakeModel',
                                            resolve     :   {
                                                                makeModelsCollection    : function() { return $scope.makeModelsCollection;   },
                                                                carUpdateInfo           : function() { return carUpdateInfo;                 }
                                                            }
                                        })
                                        .result.then( function( newMake )
                                        {
                                            if( carUpdateInfo.updateType == 'new' )
                                            { 
                                                idx_forNewMakeInsertID  = $scope.makeModelsCollection.length;
                                                var make                = { make            : newMake, 
                                                                            idMake          : -1,
                                                                            idxSelectedModel:  0,
                                                                            models          : [] };

                                                $scope.makeModelsCollection.push( make );
                                                formData_addCar.selectedMakeModels =  $scope.makeModelsCollection[ idx_forNewMakeInsertID ];
                                                dbCarService.addMake( $scope, newMake );// make ajax call to update DB
                                            }
                                            else                                           
                                            {
                                                formData_addCar.selectedMakeModels.make = newMake;
                                                dbCarService.updateMake( $scope, formData_addCar.selectedMakeModels.idMake, newMake );// make ajax call to update DB
                                            }
                                        },
                                        function()
                                        {
                                            //alert( 'dismissed' );
                                        });

    } // $scope.addUpdateMakeDialog

    //-----------------------------------------------------------
    $scope.deleteMakeConfirm =          function( formData_addCar )
    {
        var messageDetails              =   { 
                                                title               : "Please Confirm Deletion",
                                                message1            : "Please Confirm DELETION of Car Make: ",
                                                message1_highlight  : formData_addCar.selectedMakeModels.make,
                                                message2            : "Please Note: This will also DELETE all models of that make as well.",
                                                message2_highlight  : ""
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
                                                // get index to splice
                                                var iSplice =-1
                                                for( var i=0; i < $scope.makeModelsCollection.length; i++ )
                                                {
                                                    if( $scope.makeModelsCollection[i].make == formData_addCar.selectedMakeModels.make ) { iSplice= i }
                                                }

                                                // splice/remove the make of car
                                                if( iSplice >= 0 ) 
                                                { 
                                                    //alert( "make:" + formData_addCar.selectedMakeModels.make + " -->id:" + formData_addCar.selectedMakeModels.idMake );

                                                    dbCarService.deleteMake( $scope, formData_addCar.selectedMakeModels.idMake );// make ajax call to delete make in DB

                                                    $scope.makeModelsCollection.splice( iSplice, 1 ); 
                                                    formData_addCar.selectedMakeModels = $scope.makeModelsCollection[0];
                                                    formData_addCar.selectedModel      = formData_addCar.selectedMakeModels.models[ formData_addCar.selectedMakeModels.idxSelectedModel ];
                                                
                                                }
                                            },
                                            function()
                                            {
                                                //alert( 'dismissed' );
                                            });

    } // $scope.deleteMakeConfirm

    //-----------------------------------------------------------
    // Model 
    //-----------------------------------------------------------
    $scope.addUpdateModelDialog     =   function( updateType, formData_addCar )
    {
        var carUpdateInfo           =   { 
                                            updateType      : updateType,
                                            make            : formData_addCar.selectedMakeModels.make,
                                            model           : (updateType == 'new')? '' : formData_addCar.selectedModel 
                                        }

        var objAddUpdateMakeDialog  =   $modal.open( 
                                        {
                                            templateUrl :   'enterModelOfCar.htm',
                                            controller  :   'dialogModelObjectController',
                                            windowClass :   'dialogAddUpdateMakeModel',
                                            resolve     :   {
                                                                modelsCollection    : function() { return formData_addCar.selectedMakeModels.models;   },
                                                                carUpdateInfo       : function() { return carUpdateInfo;                        }
                                                            }
                                        })
                                        .result.then( function( newModelName )
                                        {
                                            if( carUpdateInfo.updateType == 'new' )
                                            { 
                                                dbCarService.addModel( $scope, formData_addCar.selectedMakeModels.idMake, newModelName );// make ajax call to add model to DB

                                                idx_forNewModelInsertID = formData_addCar.selectedMakeModels.models.length;
                                                var model               = {     model   : newModelName, 
                                                                                idModel : -1,
                                                                                idx     : idx_forNewModelInsertID }
                                                formData_addCar.selectedMakeModels.models.push( model );
                                                formData_addCar.selectedModel  = formData_addCar.selectedMakeModels.models[ idx_forNewModelInsertID ];
                                                postAjaxUpdate_Models   = formData_addCar.selectedMakeModels.models;
                                            }
                                            else                                           
                                            {
                                                dbCarService.updateModel( $scope, formData_addCar.selectedModel.idModel, newModelName );// make ajax call to add model to DB
                                                formData_addCar.selectedModel.model = newModelName;
                                            }
                                        },
                                        function()
                                        {
                                            //alert( 'dismissed' );
                                        });

    } // $scope.addUpdateMakeDialog

    //-----------------------------------------------------------
    $scope.deleteModelConfirm           =   function( formData_addCar )
    {

        var messageDetails              =   { 
                                                title               : "Please Confirm Deletion",
                                                message1            : "Please Confirm DELETION of Car Model: ",
                                                message1_highlight  : formData_addCar.selectedModel.model,
                                                message2            : "Please Note: This will only DELETE this particular model for Car Make:",
                                                message2_highlight  : formData_addCar.selectedMakeModels.make
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
                                                // get index to splice
                                                var iSplice = -1;
                                                for( var i=0; i < formData_addCar.selectedMakeModels.models.length; i++ )
                                                {
                                                    if( formData_addCar.selectedMakeModels.models[i].model == formData_addCar.selectedModel.model ) { iSplice= i }
                                                    if( iSplice != -1 )                                                                             { formData_addCar.selectedMakeModels.models[i].idx-- } // shift idx down one to compensate for the splice
                                                }

                                                // splice/remove the make of car
                                                if( iSplice != -1 ) 
                                                { 
                                                    dbCarService.deleteModel( $scope, formData_addCar.selectedModel.idModel );// make ajax call to delete model in DB

                                                    formData_addCar.selectedMakeModels.models.splice( iSplice, 1 ); 
                                                    formData_addCar.selectedModel = formData_addCar.selectedMakeModels.models[0];

                                                }
                                            },
                                            function()
                                            {
                                                //alert( 'dismissed' );
                                            });


    } // $scope.deleteModelConfirm


    //-------------------------------------------------------
    // ajax Response Handlers
    //-------------------------------------------------------

    $scope.getAllMakeModelsFailure  =   function( data ) { } 
    $scope.getAllMakeModelsSuccess  =   function( data ) 
                                        { 
                                            $scope.makeModelsCollection                 = JSON.parse( stripDataFromAjaxData( data ));
                                            $scope.formData_addCar.selectedMakeModels   = $scope.makeModelsCollection[0];
                                            $scope.formData_addCar.selectedModel        = ( $scope.makeModelsCollection.length > 0 )? $scope.formData_addCar.selectedMakeModels.models[0] : '';

                                            // add the indexes for view manipulation
                                            for( var iMakeModels in $scope.makeModelsCollection )
                                            {
                                                $scope.makeModelsCollection[ iMakeModels ].idxSelectedModel = 0;

                                                for( var iModel in $scope.makeModelsCollection[ iMakeModels ].models )
                                                {
                                                    $scope.makeModelsCollection[ iMakeModels ].models[ iModel ].idx = iModel;
                                                }
                                            }

                                        } // getAllMakeModelsSuccess

    // Make response handlers add/update/delete
    //
    $scope.addCarToListAndSellFailure   =   function( data ) 
                                            { 
                                                alert( "Addition of New Car failed :: Duplicate Rego/VIN"    ); 

                                                $scope.errorMessages    = []; // create new array
                                                $scope.errorMessages.push( "Addition of New Car failed :: Duplicate Rego/VIN" );
                                                $scope.isShowErrorBox_addCar        = true;
                                                $scope.isShowSuccessBox_addar       = false;
                                            }

    $scope.addCarToListAndSellSuccess   =   function( data ) 
                                            { 
                                                alert( "Addition of New Car succeeded" ); 
                                                $scope.successMessage                   = "Addition of New Car succeeded";
                                                $scope.isShowErrorBox_addCar       = false;
                                                $scope.isShowSuccessBox_addCar     = true;
                                            }

    $scope.addMakeFailure               =   function( data ) {} 
    $scope.addMakeSuccess               =   function( data ) { $scope.makeModelsCollection[ idx_forNewMakeInsertID ].idMake = stripDataFromAjaxData( data ); } 

    $scope.updateMakeFailure            =   function( data ) {} 
    $scope.updateMakeSuccess            =   function( data ) {}

    $scope.deleteMakeFailure            =   function( data ) {} 
    $scope.deleteMakeSuccess            =   function( data ) {}

    // Model response handlers add/update/delete
    //
    $scope.addModelFailure              =   function( data ) {} 
    $scope.addModelSuccess              =   function( data ) { postAjaxUpdate_Models[ idx_forNewModelInsertID ].idModel = stripDataFromAjaxData( data ); } 

    $scope.updateModelFailure           =   function( data ) {} 
    $scope.updateModelSuccess           =   function( data ) {}

    $scope.deleteModelFailure           =   function( data ) {} 
    $scope.deleteModelSuccess           =   function( data ) {}



    //----------------------------------------------------------------------------------
    //----------------------------------------------------------------------------------
    // Update Car
    //----------------------------------------------------------------------------------
    $scope.isCollapsed_getCarToUpdate                   = false;
    $scope.isCollapsed_searchResultsCarToUpdate         = true;
    $scope.isShow_searchResultsCarToUpdate_listing      = true;
    $scope.isShow_searchResultsCarToUpdate_detail       = false;
    $scope.isShow_searchResultsCarToUpdate_noResults    = false;
    $scope.isShow_backToCarToUpdateListingButton        = false;

    $scope.selectedCarToUpdate                          = "";
    $scope.carToUpdateCollection                        = [];
    $scope.formData_updateCar                           = {};

    $scope.formData_updateCar.selectedMakeModels        = "";    //$scope.makeModelsCollection[0];
    $scope.formData_updateCar.selectedModel             = "";    //( $scope.makeModelsCollection.length > 0 )? $scope.formData_updateCar.selectedMakeModels.models[0] : '';

    $scope.formData_updateCar.year                      = '';
    $scope.formData_updateCar.price                     = '';

    $scope.formData_updateCar.selectedTransmission      = $scope.transmissions[0];
    $scope.formData_updateCar.selectedFuelType          = $scope.fuelTypes[0];
    $scope.formData_updateCar.selectedDriveType         = $scope.driveTypes[0];
    $scope.formData_updateCar.cylinders                 = "";
    $scope.formData_updateCar.kilometres                = "";
    $scope.formData_updateCar.engineSizeCCs             = "";
    $scope.formData_updateCar.powerkW                   = "";

    $scope.formData_updateCar.selectedBodyType          = $scope.bodyTypes[0];
    $scope.formData_updateCar.seats                     = "";
    $scope.formData_updateCar.colourInterior            = "";
    $scope.formData_updateCar.colourExterior            = "";
    $scope.formData_updateCar.selectedNumDoors          = $scope.doors[0];

    $scope.formData_updateCar.isNewCar                  = false;
    $scope.formData_updateCar.rego                      = "";
    $scope.formData_updateCar.VIN                       = "";
    $scope.formData_updateCar.idCar                     = "-1";

    $scope.formData_updateCar.selectedPurchaseStatus    = "";
    $scope.formData_updateCar.photoID                   = "";
    $scope.formData_updateCar.photoFilename             = "";
    
    $scope.isShow_primaryPhotoLabel                     = false;

    //-----------------------------------------------------------
    // work variables
    //
    var idCar_forNewPhoto                               = "";
    var newControlInputFile                             = "";
    var idx_ofCurrentlyEnlargedPhoto                    = -1;

    //-----------------------------------------------------------
    $scope.setIsShowEnterValues         = function( isShow_enterValues )
    {
        $scope.isShow_enterValues = isShow_enterValues;

    } // $scope.setIsShowEnterValues

    //-----------------------------------------------------------
    $scope.clearCarToUpdateFields       =   function()
    {
        $scope.formData_updateCar.rego                  = "";
        $scope.formData_updateCar.VIN                   = "";

    } // $scope.clearCarToUpdateFields

    //-----------------------------------------------------------
    $scope.getCarToUpdate               =   function()
    {
        housekeeping.isShow_ajaxLoader = true;
        dbCarService.getCarToUpdate( $scope, $scope.formData_updateCar );

    } // $scope.getCarToUpdate

    //-----------------------------------------------------------
    $scope.selectCarFromListing         =   function( idx )
    {
        $scope.selectedCarToUpdate                                  = $scope.carToUpdateCollection[ idx ];
        $scope.isShow_searchResultsCarToUpdate_noResults            = false;     
        $scope.isShow_searchResultsCarToUpdate_listing              = false;     
        $scope.isShow_searchResultsCarToUpdate_detail               = true;     housekeeping.mainContentHeight = "1265px"; // dynamically adjust height of screen  
        $scope.isCollapsed_getCarToUpdate                           = true;
        $scope.isShow_enterValues                                   = true;

        newControlInputFile                                         = "";
        idCar_forNewPhoto                                           = $scope.selectedCarToUpdate.idCar;

        updateCarScopeData( $scope, $scope.formData_updateCar, $scope.selectedCarToUpdate );
        dbCarService.getCarPhotos( $scope, idCar_forNewPhoto );

    } // $scope.selectCarFromListing

    //-----------------------------------------------------------
    $scope.goBackToCarToUpdateListing   =   function()
    {
        document.getElementById( "imgLoadedPhoto" ).src     = ""; // reset the image to nothing
        //$scope.loadPhotoFilename                          = "";
        $scope.photoFiles                                   = [];
        //$scope.isShow_loadedPhoto                           = false;
        //$scope.isShow_enterValues                           = true;

        $scope.isShow_searchResultsCarToUpdate_listing      = ( $scope.carToUpdateCollection.length > 0 )? true : false;     
        $scope.isShow_searchResultsCarToUpdate_detail       = false;    housekeeping.mainContentHeight = "1000px"; // dynamically adjust height of screen

    } // $scope.goBackToCarToUpdateListing

    //-----------------------------------------------------------
    $scope.updateCar                    =   function() 
    { 
        if( preDBUpdateCheckEnteredCarValues( $scope.formData_updateCar ) )        
        {
            housekeeping.isShow_ajaxLoader  = true;
            fixPrimaryPhotoOnUpdate();
            dbCarService.updateCar( $scope, $scope.formData_updateCar ); 
        } 
    } // $scope.updateCar

    //-----------------------------------------------------------
    $scope.deleteCar                    =   function() 
    { 
        var messageDetails              =   { 
                                                title               : "Please Confirm Deletion",
                                                message1            : "Please Confirm DELETION of Car Rego: ",
                                                message1_highlight  : $scope.formData_updateCar.rego,
                                                message2            : "Please Note: This action will Completely REMOVE this Car from the database",
                                                message2_highlight  : ""
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
                                                dbCarService.deleteCar( $scope, $scope.formData_updateCar ); // make ajax call to delete model in DB
                                            },
                                            function()
                                            {
                                                //alert( 'dismissed' );
                                            });

    } // $scope.deleteCar

    //-----------------------------------------------------------

    $scope.updateCarCancel              =   function() 
    { 
        $scope.goBackToCarToUpdateListing();        

    } // $scope.updateCarCancel

    //-----------------------------------------------------------
    // Photos
    //-----------------------------------------------------------
    $scope.loadPhotoFile                    = function( $files )
    {
        if( newControlInputFile != "" )
        {
            alert( "We apologise, but this version only allows 1 new photo per update..." );
        }
        else
        {
            newControlInputFile             =   $files[0];
            var photoFile                   =   {
                                                    idCar       : idCar_forNewPhoto,
                                                    idPhoto     : "",
                                                    action      : "insert",
                                                    file        : newControlInputFile,
                                                    imgSrc      : ""
                                                }
                                
            photoFile.idx                   =   $scope.photoFiles.push( photoFile ) - 1;
                               

            var fReader                     =   new FileReader();
            fReader.onload                  =   function( e )
                                                {
                                                    photoFile.imgSrc = e.target.result; //fReader.result; 
                                                    $scope.showEnlargedPhoto( photoFile.idx );
                                                    //document.getElementById( "imgLoadedPhoto" ).src = 
                                                    //$scope.isShow_loadedPhoto     = true;
                                                }

            fReader.readAsDataURL( newControlInputFile );
        }

    } // $scope.loadPhotoFile


    //-----------------------------------------------------------
    $scope.showEnlargedPhoto            = function( idxPhoto )
    {
//        alert( idxPhoto );
        document.getElementById( "imgLoadedPhoto" ).src = (typeof $scope.photoFiles[ idxPhoto ].name == 'undefined')? $scope.photoFiles[ idxPhoto ].imgSrc : $scope.photoFiles[ idxPhoto ].name;      
        idx_ofCurrentlyEnlargedPhoto = idxPhoto;
        $scope.isShow_primaryPhotoLabel = isEnlargedPhotoThePrimary();


    } // $scope.showEnlargedPhoto

    //-----------------------------------------------------------
    $scope.filterPhotoFileThumbnail     = function( photoFile )
    {
        return ( ( typeof photoFile.action == 'undefined' ) || ( photoFile.action != "delete" )  );

    } // $scope.filterPhotoFileThumbnail

    //-----------------------------------------------------------
    $scope.getThumbnailFile             = function( photoFile )
    {
        return (typeof photoFile.name != 'undefined')? photoFile.name : photoFile.imgSrc;

    } // $scope.getThumbnailFile
    
    //-----------------------------------------------------------
    $scope.makePrimaryPhoto             = function()
    {
        for( var iPhotoFile in $scope.photoFiles ) { $scope.photoFiles[ iPhotoFile ].isPrimary = false; }  // reset all photos to non-primary
        $scope.photoFiles[ idx_ofCurrentlyEnlargedPhoto ].isPrimary = true;                     // set the new primary photo
        $scope.isShow_primaryPhotoLabel = isEnlargedPhotoThePrimary();

    } // $scope.makePrimaryPhoto

    //-----------------------------------------------------------
    $scope.deletePhoto                  = function( )
    {

        // remove car from photoFiles list
        //
        if( $scope.photoFiles[ idx_ofCurrentlyEnlargedPhoto ].idPhoto == "" )   // its the new car
        {
            $scope.photoFiles.splice( idx_ofCurrentlyEnlargedPhoto, 1 );
            newControlInputFile = "";

            // no need is usually last one...
            //for( var iPhotoFile = idx_ofCurrentlyEnlargedPhoto; iPhotoFile < $scope.photoFiles.length-1; iPhotoFile++ ) { $scope.photoFiles[ iPhotoFile ].idx = iPhotoFile; } 
            
        }
        else    // car already exist in db - mark as delete
        {
            $scope.photoFiles[ idx_ofCurrentlyEnlargedPhoto ].action = "delete";
        }


        // re-assign new enlarged photo to first non-deleted photo
        //
        idx_ofCurrentlyEnlargedPhoto = -1;
        for( var iPhotoFile in $scope.photoFiles )
        {
            if( ( typeof $scope.photoFiles[ iPhotoFile ].action == 'undefined' ) || ( $scope.photoFiles[ iPhotoFile ].action != "delete" ) )
            {
                idx_ofCurrentlyEnlargedPhoto = iPhotoFile;
                document.getElementById( "imgLoadedPhoto" ).src = (typeof $scope.photoFiles[ idx_ofCurrentlyEnlargedPhoto ].name == 'undefined')? $scope.photoFiles[ idx_ofCurrentlyEnlargedPhoto ].imgSrc : $scope.photoFiles[ idx_ofCurrentlyEnlargedPhoto ].name;      
                $scope.isShow_primaryPhotoLabel = isEnlargedPhotoThePrimary();
                break;
            }
        }

        // no non-deleted photo found
        if( idx_ofCurrentlyEnlargedPhoto == -1 ) { document.getElementById( "imgLoadedPhoto" ).src = ""; }


    } // $scope.deletePhoto

    //-----------------------------------------------------------
    function isEnlargedPhotoThePrimary()
    {
        if( $scope.photoFiles.length == 0 )                                                             { return false; }
        else if( idx_ofCurrentlyEnlargedPhoto < 0 )                                                     { return false; }
        else if ( typeof $scope.photoFiles[ idx_ofCurrentlyEnlargedPhoto ].isPrimary == 'undefined' )   { return false; }
        else                                                                                            { return $scope.photoFiles[ idx_ofCurrentlyEnlargedPhoto ].isPrimary; }

    } // isEnlargedPhotoThePrimary

    //-----------------------------------------------------------
    function fixPrimaryPhotoOnUpdate()
    {
        var idx_ofNonDeletedPhoto   = -1;
        var idx_primaryPhoto        = -1;

        //check to see if there is a primary photo set
        //
        for( var iPhotoFile in $scope.photoFiles )
        {
            if( ( typeof $scope.photoFiles[ iPhotoFile ].action == 'undefined' ) || ( $scope.photoFiles[ iPhotoFile ].action != "delete" ) )
            {
                idx_ofNonDeletedPhoto = (idx_ofNonDeletedPhoto > 0)? idx_ofNonDeletedPhoto : iPhotoFile;

                if( ( typeof $scope.photoFiles[ iPhotoFile ].isPrimary != 'undefined' ) && ( $scope.photoFiles[ iPhotoFile ].isPrimary )  )
                {
                    idx_primaryPhoto = iPhotoFile;
                    break;
                }
            }
        }

        // update relevant variables and collections accordingly
        //        
        if( ( idx_primaryPhoto == -1 ) && ( idx_ofNonDeletedPhoto >= 0 ) )
        { 
            // set primary photo if there isn't one
            //
            $scope.photoFiles[ idx_ofNonDeletedPhoto ].isPrimary = true; 
            $scope.formData_updateCar.photoID = $scope.photoFiles[ idx_ofNonDeletedPhoto ].idPhoto;
        }
        else if( ( idx_primaryPhoto != -1 ) && ( $scope.photoFiles[ idx_primaryPhoto ].idPhoto != "" ) )
        {           
            // update the $scope.formData_updateCar.photoID so it will be updated together with the db update for 
            //

            $scope.formData_updateCar.photoID       = $scope.photoFiles[ idx_primaryPhoto ].idPhoto;    
            $scope.formData_updateCar.photoFilename = $scope.photoFiles[ idx_primaryPhoto ].name;    
        }
        else
        {
            // there is no primary photo 
            $scope.formData_updateCar.photoID       = "";
            $scope.formData_updateCar.photoFilename = "";    
        }
        
    } // fixPrimaryPhotoOnUpdate      

    //-------------------------------------------------------
    // ajax Response Handlers
    //-------------------------------------------------------
    $scope.getCarToUpdateFailure        =   function( data )  
                                            { 
                                                housekeeping.isShow_ajaxLoader                              = false;
                                                alert("Cannot retrieve car details"); 
                                            }
    $scope.getCarToUpdateSuccess        =   function( data )  
                                            { 
                                                housekeeping.isShow_ajaxLoader                              = false;
                                                $scope.isCollapsed_searchResultsCarToUpdate                 = false;
                                                $scope.carToUpdateCollection                                = JSON.parse( stripDataFromAjaxData( data ));

                                                switch( $scope.carToUpdateCollection.length )      
                                                {
                                                    case 0: // No Result
                                                        $scope.isShow_searchResultsCarToUpdate_noResults    = true;     
                                                        $scope.isShow_searchResultsCarToUpdate_listing      = false;     
                                                        $scope.isShow_searchResultsCarToUpdate_detail       = false;    housekeeping.mainContentHeight = "500px"; // dynamically adjust height of screen                                                  
                                                        break;

                                                    case 1: // Detail
                                                        $scope.selectCarFromListing( 0 );
                                                        break;

                                                    default: // Listing     
                                                        $scope.isShow_searchResultsCarToUpdate_listing      = true;     
                                                        $scope.isShow_searchResultsCarToUpdate_noResults    = false;     
                                                        $scope.isShow_searchResultsCarToUpdate_detail       = false;    housekeeping.mainContentHeight = "1000px"; // dynamically adjust height of screen
                                                        $scope.isShow_backToCarToUpdateListingButton        = true;
                                                        $scope.isCollapsed_getCarToUpdate                   = true;
                                                }

                                            } // getCarToUpdateSuccess

    $scope.updateCarFailure             =   function( data )  { alert("Failed to Update Car Details");  }
    $scope.updateCarSuccess             =   function( data )  
                                            { 
                                                updateSelectedCarToUpdateRecordFromFormData( $scope.selectedCarToUpdate, $scope.formData_updateCar ); // update listing data 

                                                //check if we need to turn ajax loader icon off
                                                var bTurnOffAjaxLoader = true;
                                                for( iPhotoFile in $scope.photoFiles ) { if( typeof $scope.photoFiles[ iPhotoFile ].action != 'undefined' ) { bTurnOffAjaxLoader = false; break; } }
                                                if( bTurnOffAjaxLoader )
                                                {
                                                    housekeeping.isShow_ajaxLoader                          = false;
                                                    $scope.goBackToCarToUpdateListing();
                                                }

                                            } // $scope.updateCarSuccess

    $scope.updateCarPhotosFailure       =   function( data )  
                                            { 
                                                housekeeping.isShow_ajaxLoader                              = false;
                                                alert("Failed to Update Car Photos");  
                                            }
    $scope.updateCarPhotosSuccess       =   function( data )  
                                            {
                                                housekeeping.isShow_ajaxLoader                              = false;
                                                var strippedData                                            = stripDataFromAjaxData( data );
                                                if( strippedData != "" ) 
                                                { 
                                                    var photoOfNewlyInsertedCar                 = JSON.parse( strippedData ); // update the primary photo ID and photoFilename in current collection of cars to update
                                                    $scope.selectedCarToUpdate.photoID          = photoOfNewlyInsertedCar.idPhoto; 
                                                    $scope.selectedCarToUpdate.photoFilename    = photoOfNewlyInsertedCar.name; 
                                                }

                                                alert("Updated Car Details & Photos Successfully"); 

                                                $scope.goBackToCarToUpdateListing();

                                            } // $scope.updateCarPhotosSuccess       


    $scope.deleteCarFailure             =   function( data )  { alert("Failed to Delete Car Details");  }
    $scope.deleteCarSuccess             =   function( data )  
                                            { 
                                                alert("Deleted Car Successfully");
                                                var idxCar = -1;
                                                for( var iCar in $scope.carToUpdateCollection ) { if( $scope.carToUpdateCollection[ iCar ].idCar == $scope.selectedCarToUpdate.idCar ) { idxCar = iCar; break; } }
                                                $scope.carToUpdateCollection.splice( idxCar, 1 );  // remove car from collection
                                                $scope.goBackToCarToUpdateListing();

                                            } // $scope.deleteCarSuccess

    $scope.getCarPhotosFailure          =   function( data ) { alert( "Failed to Get Photos for Car" ); }
    $scope.getCarPhotosSuccess          =   function( data ) 
                                            { 
                                                //alert( "Succeeded to Get Photos for Car" ); 

                                                $scope.photoFiles = JSON.parse( stripDataFromAjaxData( data ));

                                                // update other necessary variables for $scope.photoFiles
                                                //
                                                idx_ofCurrentlyEnlargedPhoto = -1;
                                                for( var iPhotoFile in $scope.photoFiles ) 
                                                {
                                                    $scope.photoFiles[ iPhotoFile ].idx = iPhotoFile;  // so the photoFile knows its own position in the array

                                                    $scope.photoFiles[ iPhotoFile ].isPrimary = false; 
                                                    if( $scope.formData_updateCar.photoID == $scope.photoFiles[ iPhotoFile ].idPhoto ) 
                                                    { 
                                                        idx_ofCurrentlyEnlargedPhoto = iPhotoFile; 
                                                        $scope.photoFiles[ idx_ofCurrentlyEnlargedPhoto ].isPrimary = true; 
                                                        document.getElementById( "imgLoadedPhoto" ).src = $scope.photoFiles[ idx_ofCurrentlyEnlargedPhoto ].name; 
                                                        
                                                    }
                                                    
                                                }

                                                if( idx_ofCurrentlyEnlargedPhoto == -1 ) 
                                                { 
                                                    document.getElementById( "imgLoadedPhoto" ).src = $scope.photoFiles[0].name; 
                                                    idx_ofCurrentlyEnlargedPhoto = 0;
                                                }

                                                $scope.isShow_primaryPhotoLabel = isEnlargedPhotoThePrimary();

                                            } // $scope.getCarPhotosSuccess



}); // handleCarController


//-------------------------------------------------------
//-------------------------------------------------------
//-------------------------------------------------------
app.controller('dialogMakeObjectController', function ($scope, $modalInstance, makeModelsCollection, carUpdateInfo ) 
{
    $scope.title1   =   (carUpdateInfo.updateType == 'new')? "Please Enter"         : "Please Update";
    $scope.title2   =   (carUpdateInfo.updateType == 'new')? "the New Make of Car"  : "the Make of Car";
    
    $scope.make     =   carUpdateInfo.make;

    $scope.cancel   =   function () { $modalInstance.dismiss('cancel');   };
    $scope.ok       =   function () 
                        { 
                            var bOk = true;
                            for( var iRecord in makeModelsCollection )
                            {
                                if( makeModelsCollection[iRecord].make.toUpperCase() == $scope.make.toUpperCase() ) 
                                {
                                    bOk = false;
                                    break;
                                }
                            }

                            if( bOk )   { $modalInstance.close( $scope.make ); }
                            else        { alert('Opps! That Make of Car Already exists in our Collection'); }
                        };

}); // dialogMakeObjectController

//-------------------------------------------------------
app.controller('dialogModelObjectController', function ($scope, $modalInstance, modelsCollection, carUpdateInfo ) 
{
    $scope.title1       =   (carUpdateInfo.updateType == 'new')? "Please Enter"         : "Please Update";
    $scope.title2       =   (carUpdateInfo.updateType == 'new')? "the New Model of Car" : "the Model of Car";
    
    $scope.make         =   carUpdateInfo.make;
    $scope.model        =   carUpdateInfo.model.model;

    $scope.cancel       =   function () { $modalInstance.dismiss('cancel');   };
    $scope.ok           =   function () 
                            { 
                                var bOk = true;
                                for( var iModel in modelsCollection )
                                {
                                    if( modelsCollection[iModel].model.toUpperCase() == $scope.model.toUpperCase() ) 
                                    {
                                        bOk = false;
                                        break;
                                    }
                                }

                                if( bOk )   { $modalInstance.close( $scope.model ); }
                                else        { alert("Opps! That Model of Car Already exists for '" + $scope.make + "' in our Collection"); }
                            };

}); // dialogModelObjectController

//-------------------------------------------------------
// Normal / Non-Angular functions
//-------------------------------------------------------

                 
//-------------------------------------------------------
// updateCarScopeData
//
// Description: copies data from selected record to formData
//-------------------------------------------------------
function updateCarScopeData( $scope, formData, selectedCarToUpdate )
{
    var idxMake = 0;
    for( var iMake in $scope.makeModelsCollection ) { if( $scope.makeModelsCollection[ iMake ].make == selectedCarToUpdate.make ) { idxMake = iMake; break; } }
    formData.selectedMakeModels        = $scope.makeModelsCollection[ idxMake ];

    var idxModel = 0;
    for( var iModel in $scope.makeModelsCollection[ idxMake ].models ) { if( $scope.makeModelsCollection[ idxMake ].models[ iModel ].model == selectedCarToUpdate.model ) { idxModel = iModel; break; } }
    formData.selectedModel             = $scope.makeModelsCollection[ idxMake ].models[ idxModel ];

    formData.year                      = selectedCarToUpdate.year;
    formData.price                     = selectedCarToUpdate.price;

    var idxTransmission = 0;
    for( var iTransmission in $scope.transmissions ) { if( $scope.transmissions[ iTransmission ].transmission == selectedCarToUpdate.transmission ) { idxTransmission = iTransmission; break; } }
    formData.selectedTransmission      = $scope.transmissions[ idxTransmission ];

    var idxFuelType = 0;
    for( var iFuelType in $scope.fuelTypes ) { if( $scope.fuelTypes[ iFuelType ].fuelType == selectedCarToUpdate.fuelType ) { idxFuelType = iFuelType; break; } }
    formData.selectedFuelType          = $scope.fuelTypes[ idxFuelType ];

    var idxDriveType = 0;
    for( var iDriveType in $scope.driveTypes ) { if( $scope.driveTypes[ iDriveType ].driveType == selectedCarToUpdate.driveType ) { idxDriveType = iDriveType; break; } }
    formData.selectedDriveType         = $scope.driveTypes[ idxDriveType ];

    formData.cylinders                 = selectedCarToUpdate.cylinders;
    formData.kilometres                = selectedCarToUpdate.kilometres;
    formData.engineSizeCCs             = selectedCarToUpdate.engineSizeCCs;
    formData.powerkW                   = selectedCarToUpdate.powerkW;

    var idxBodyType = 0;
    for( var iBodyType in $scope.bodyTypes ) { if( $scope.bodyTypes[ iBodyType ].bodyType == selectedCarToUpdate.bodyType ) { idxBodyType = iBodyType; break; } }
    formData.selectedBodyType          =  $scope.bodyTypes[ idxBodyType ];

    formData.seats                     =  selectedCarToUpdate.seats;
    formData.colourInterior            =  selectedCarToUpdate.colourInterior;
    formData.colourExterior            =  selectedCarToUpdate.colourExterior;

    var idxNumDoors = 0;
    for( var iNumDoors in $scope.doors ) { if( $scope.doors[ iNumDoors ].numDoors == selectedCarToUpdate.doors ) { idxNumDoors = iNumDoors; break; } }
    formData.selectedNumDoors          =  $scope.doors[ idxNumDoors ];

    formData.isNewCar                  =  selectedCarToUpdate.isNewCar;
    formData.rego                      =  selectedCarToUpdate.rego;
    formData.VIN                       =  selectedCarToUpdate.VIN;

    formData.idCar                     =  selectedCarToUpdate.idCar;

    var idxPurchaseStatusType = 0;
    for( var iPurchaseStatusType in $scope.purchaseStatusTypes ) { if( $scope.purchaseStatusTypes[ iPurchaseStatusType ].value == selectedCarToUpdate.purchaseStatus ) { idxPurchaseStatusType = iPurchaseStatusType; break; } }
    formData.selectedPurchaseStatus    =  $scope.purchaseStatusTypes[ idxPurchaseStatusType ];

    formData.photoID                    =  selectedCarToUpdate.photoID;
    formData.photoFilename              =  selectedCarToUpdate.photoFilename;

} // updateCarScopeData

//-------------------------------------------------------
// updateSelectedCarToUpdateRecordFromFormData
//
// Description: copies data from formData to selected record 
//-------------------------------------------------------
function updateSelectedCarToUpdateRecordFromFormData( selectedCarToUpdate, formData )
{
    selectedCarToUpdate.make            = formData.selectedMakeModels.make;
    selectedCarToUpdate.model           = formData.selectedModel.model;
    selectedCarToUpdate.modelID         = formData.selectedModel.idModel;

    selectedCarToUpdate.year            = formData.year;
    selectedCarToUpdate.price           = formData.price;

    selectedCarToUpdate.transmission    = formData.selectedTransmission.transmission;
    selectedCarToUpdate.fuelType        = formData.selectedFuelType.fuelType;
    selectedCarToUpdate.driveType       = formData.selectedDriveType.driveType;
    selectedCarToUpdate.cylinders       = formData.cylinders;
    selectedCarToUpdate.kilometres      = formData.kilometres;
    selectedCarToUpdate.engineSizeCCs   = formData.engineSizeCCs;
    selectedCarToUpdate.powerkW         = formData.powerkW;

    selectedCarToUpdate.bodyType        = formData.selectedBodyType.bodyType;

    selectedCarToUpdate.seats           = formData.seats;
    selectedCarToUpdate.colourInterior  = formData.colourInterior;
    selectedCarToUpdate.colourExterior  = formData.colourExterior;
    selectedCarToUpdate.doors           = formData.selectedNumDoors.numDoors;

    selectedCarToUpdate.isNewCar        = formData.isNewCar;
    selectedCarToUpdate.rego            = formData.rego;
    selectedCarToUpdate.VIN             = formData.VIN;

    selectedCarToUpdate.purchaseStatus  = formData.selectedPurchaseStatus.value;
    selectedCarToUpdate.photoID         = formData.photoID;
    selectedCarToUpdate.photoFilename   = formData.photoFilename;

} // updateSelectedCarToUpdateRecordFromFormData


