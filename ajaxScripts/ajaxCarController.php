<?php
session_start();

require_once    'include/class.basicDB.inc.php';

//---------------------------------------------------------------------------------------------
class c_carDetailsStruct
{
    public $idCar           = '';
    public $modelID         = '';
    public $make            = '';
    public $model           = '';
    public $year            = '';
    public $price           = '';
    public $transmission    = '';
    public $fuelType        = '';
    public $driveType       = '';
    public $cylinders       = '';
    public $kilometres      = '';
    public $engineSizeCCs   = '';
    public $powerkW         = '';
    public $bodyType        = '';
    public $seats           = '';
    public $colourInterior  = '';
    public $colourExterior  = '';
    public $doors           = '';
    public $isNewCar        = '';
    public $rego            = '';
    public $VIN             = '';
    public $purchaseStatus  = '';
    public $photoID         = '';
    public $photoFilename   = '';

} // c_carDetailsStruct

//---------------------------------------------------------------------------------------------
class c_carSearchStruct
{
    public $idMake              = '';
    public $idModel             = '';

    public $fromYear            = '';
    public $toYear              = '';

    public $fromPrice           = '';
    public $toPrice             = '';

    public $transmission        = '';
    public $fuelType            = '';
    public $driveType           = '';

    public $fromCylinders       = '';
    public $toCylinders         = '';

    public $fromKilometres      = '';
    public $toKilometres        = '';

    public $fromEngineSizeCCs   = '';
    public $toEngineSizeCCs     = '';

    public $fromPowerkW         = '';
    public $toPowerkW           = '';

    public $bodyType            = '';

    public $fromSeats           = '';
    public $toSeats             = '';

    public $colourInterior      = '';
    public $colourExterior      = '';

    public $fromDoors           = '';
    public $toDoors             = '';

    public $isNewCar            = '';
    public $rego                = '';
    public $VIN                 = '';
    public $purchaseStatus      = '';


} // c_carSearchStruct

//---------------------------------------------------------------------------------------------
class c_makeModelsStruct
{
    public $idMake      = -1;
    public $make        = "";
    public $models      = array();
}

class c_modelStruct
{
    public $idModel     = -1;
    public $model       = "";
}

//---------------------------------------------------------------------------------------------
class c_ajaxCarController extends c_basicDB
{

    public $makeModelsCollection    = array();
    public $carToUpdateCollection   = array();
    public $searchResults           = array();

	//---------------------------------------------------------------------------------------------
	// constructors 
	//---------------------------------------------------------------------------------------------
	function __construct()
	{
		parent::__construct();
		
		
	} // __construct

	//---------------------------------------------------------------------------------------------
	// destructors
	//---------------------------------------------------------------------------------------------
	function __destruct()
	{
		parent::__destruct();	
		
	} // __destruct

	//---------------------------------------------------------------------------------------------
    // addCarToListAndSell
    //
    // Description: adds a car to to the database for sale
	//---------------------------------------------------------------------------------------------
    function addCarToListAndSell( $objCarDetailsStruct )
    {
        assert( isset( $this->dbConnection) );

        $bSuccess   = FALSE;
		$stmtQuery  = "INSERT INTO icaweb516a_cars (modelID, year, price, engineSize, kilometres, transmission, fuelType, driveType, cylinders, powerkW, bodyType, seats, interiorColour, exteriorColour, doors, isNewCar, rego, vin, purchaseStatus)";
        $stmtQuery .= " VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)";
        
        if( $stmt = $this->dbConnection->prepare( $stmtQuery ) )
        {

            $objCarDetailsStruct->modelID           = $this->scrubInput( $objCarDetailsStruct->modelID          );
            $objCarDetailsStruct->year              = $this->scrubInput( $objCarDetailsStruct->year             );
            $objCarDetailsStruct->price             = $this->scrubInput( $objCarDetailsStruct->price            );
            $objCarDetailsStruct->transmission      = $this->scrubInput( $objCarDetailsStruct->transmission     );
            $objCarDetailsStruct->fuelType          = $this->scrubInput( $objCarDetailsStruct->fuelType         );
            $objCarDetailsStruct->driveType         = $this->scrubInput( $objCarDetailsStruct->driveType        );
            $objCarDetailsStruct->cylinders         = $this->scrubInput( $objCarDetailsStruct->cylinders        );
            $objCarDetailsStruct->kilometres        = $this->scrubInput( $objCarDetailsStruct->kilometres       );
            $objCarDetailsStruct->engineSizeCCs     = $this->scrubInput( $objCarDetailsStruct->engineSizeCCs    );
            $objCarDetailsStruct->powerkW           = $this->scrubInput( $objCarDetailsStruct->powerkW          );
            $objCarDetailsStruct->bodyType          = $this->scrubInput( $objCarDetailsStruct->bodyType         );
            $objCarDetailsStruct->seats             = $this->scrubInput( $objCarDetailsStruct->seats            );
            $objCarDetailsStruct->colourInterior    = $this->scrubInput( $objCarDetailsStruct->colourInterior   );
            $objCarDetailsStruct->colourExterior    = $this->scrubInput( $objCarDetailsStruct->colourExterior   );
            $objCarDetailsStruct->doors             = $this->scrubInput( $objCarDetailsStruct->doors            );
            $objCarDetailsStruct->isNewCar          = $this->scrubInput( $objCarDetailsStruct->isNewCar         );
            $objCarDetailsStruct->rego              = $this->scrubInput( $objCarDetailsStruct->rego             );
            $objCarDetailsStruct->VIN               = $this->scrubInput( $objCarDetailsStruct->VIN              );

            $objCarDetailsStruct->rego              = strtoupper( $objCarDetailsStruct->rego );


            $stmt->bind_param( "isdsssssississiiss",    $objCarDetailsStruct->modelID,
                                                        $objCarDetailsStruct->year,
                                                        $objCarDetailsStruct->price,
                                                        $objCarDetailsStruct->engineSizeCCs,
                                                        $objCarDetailsStruct->kilometres,
                                                        $objCarDetailsStruct->transmission, 
                                                        $objCarDetailsStruct->fuelType,
                                                        $objCarDetailsStruct->driveType,
                                                        $objCarDetailsStruct->cylinders,
                                                        $objCarDetailsStruct->powerkW,
                                                        $objCarDetailsStruct->bodyType,
                                                        $objCarDetailsStruct->seats,
                                                        $objCarDetailsStruct->colourInterior,
                                                        $objCarDetailsStruct->colourExterior,
                                                        $objCarDetailsStruct->doors,
                                                        $objCarDetailsStruct->isNewCar,
                                                        $objCarDetailsStruct->rego,
                                                        $objCarDetailsStruct->VIN );

            $bSuccess = $stmt->execute();
            $strResponseData = $this->dbConnection->insert_id;

   	        $stmt->close(); 	// Free resultset 
        }
		return $bSuccess;
    
    } // addCarToListAndSell


	//---------------------------------------------------------------------------------------------
    // updateCar
    //
    // Description: updates a car in the database
	//---------------------------------------------------------------------------------------------
    function updateCar( $objCarDetailsStruct )
    {
        assert( isset( $this->dbConnection) );

        $bSuccess   = FALSE;
		$stmtQuery  = "UPDATE icaweb516a_cars SET modelID=?, year=?, price=?, engineSize=?, kilometres=?, transmission=?, fuelType=?, driveType=?, cylinders=?, powerkW=?, bodyType=?, seats=?, interiorColour=?, exteriorColour=?, doors=?, isNewCar=?, rego=?, vin=?, purchaseStatus=?, photoID=?";
        $stmtQuery .= " WHERE idCar=?";

        if( $stmt = $this->dbConnection->prepare( $stmtQuery ) )
        {

            $objCarDetailsStruct->modelID           = $this->scrubInput( $objCarDetailsStruct->modelID          );
            $objCarDetailsStruct->year              = $this->scrubInput( $objCarDetailsStruct->year             );
            $objCarDetailsStruct->price             = $this->scrubInput( $objCarDetailsStruct->price            );
            $objCarDetailsStruct->transmission      = $this->scrubInput( $objCarDetailsStruct->transmission     );
            $objCarDetailsStruct->fuelType          = $this->scrubInput( $objCarDetailsStruct->fuelType         );
            $objCarDetailsStruct->driveType         = $this->scrubInput( $objCarDetailsStruct->driveType        );
            $objCarDetailsStruct->cylinders         = $this->scrubInput( $objCarDetailsStruct->cylinders        );
            $objCarDetailsStruct->kilometres        = $this->scrubInput( $objCarDetailsStruct->kilometres       );
            $objCarDetailsStruct->engineSizeCCs     = $this->scrubInput( $objCarDetailsStruct->engineSizeCCs    );
            $objCarDetailsStruct->powerkW           = $this->scrubInput( $objCarDetailsStruct->powerkW          );
            $objCarDetailsStruct->bodyType          = $this->scrubInput( $objCarDetailsStruct->bodyType         );
            $objCarDetailsStruct->seats             = $this->scrubInput( $objCarDetailsStruct->seats            );
            $objCarDetailsStruct->colourInterior    = $this->scrubInput( $objCarDetailsStruct->colourInterior   );
            $objCarDetailsStruct->colourExterior    = $this->scrubInput( $objCarDetailsStruct->colourExterior   );
            $objCarDetailsStruct->doors             = $this->scrubInput( $objCarDetailsStruct->doors            );
            $objCarDetailsStruct->isNewCar          = $this->scrubInput( $objCarDetailsStruct->isNewCar         );
            $objCarDetailsStruct->rego              = $this->scrubInput( $objCarDetailsStruct->rego             );
            $objCarDetailsStruct->VIN               = $this->scrubInput( $objCarDetailsStruct->VIN              );
            $objCarDetailsStruct->purchaseStatus    = $this->scrubInput( $objCarDetailsStruct->purchaseStatus   );
            $objCarDetailsStruct->idCar             = $this->scrubInput( $objCarDetailsStruct->idCar            );
            $objCarDetailsStruct->photoID           = $this->scrubInput( $objCarDetailsStruct->photoID          );

            $objCarDetailsStruct->rego              = strtoupper( $objCarDetailsStruct->rego );

            $stmt->bind_param( "isdsssssississiissiii", $objCarDetailsStruct->modelID,
                                                        $objCarDetailsStruct->year,
                                                        $objCarDetailsStruct->price,
                                                        $objCarDetailsStruct->engineSizeCCs,
                                                        $objCarDetailsStruct->kilometres,
                                                        $objCarDetailsStruct->transmission, 
                                                        $objCarDetailsStruct->fuelType,
                                                        $objCarDetailsStruct->driveType,
                                                        $objCarDetailsStruct->cylinders,
                                                        $objCarDetailsStruct->powerkW,
                                                        $objCarDetailsStruct->bodyType,
                                                        $objCarDetailsStruct->seats,
                                                        $objCarDetailsStruct->colourInterior,
                                                        $objCarDetailsStruct->colourExterior,
                                                        $objCarDetailsStruct->doors,
                                                        $objCarDetailsStruct->isNewCar,
                                                        $objCarDetailsStruct->rego,
                                                        $objCarDetailsStruct->VIN,
                                                        $objCarDetailsStruct->purchaseStatus,
                                                        $objCarDetailsStruct->photoID,
                                                        $objCarDetailsStruct->idCar );

            $bSuccess = $stmt->execute(); 

   	        $stmt->close(); 	// Free resultset 
        }
		return $bSuccess;
    
    } // updateCar

	//---------------------------------------------------------------------------------------------
    // deleteCar
    //
    // Description: deletes a car in the database
	//---------------------------------------------------------------------------------------------
    function deleteCar( $objCarDetailsStruct )
    {
        assert( isset( $this->dbConnection) );

        $bSuccess   = FALSE;
		$stmtQuery  = "DELETE FROM icaweb516a_cars WHERE idCar=?";

        if( $stmt = $this->dbConnection->prepare( $stmtQuery ) )
        {
            $objCarDetailsStruct->idCar = $this->scrubInput( $objCarDetailsStruct->idCar );
            $stmt->bind_param( "i",  $objCarDetailsStruct->idCar );
            $bSuccess = ( $stmt->execute() && ( $stmt->affected_rows == 1) );
   	        $stmt->close(); 	// Free resultset 
        }
		return $bSuccess;
    
    } // deleteCar
        
	//---------------------------------------------------------------------------------------------
    // getAllMakeModels
    //
    // Description: gets all the different makes and their models from the database
	//---------------------------------------------------------------------------------------------
	function getAllMakeModels()
	{
        assert( isset( $this->dbConnection ) );

        $bSuccess               = FALSE;
        $makeModelsCollection   = array();

        $stmtQuery  = "SELECT   idCarMake, icaweb516a_car_make.name as makeName,";
        $stmtQuery .= "         idCarModel, icaweb516a_car_model.name as modelName";
        $stmtQuery .= " FROM icaweb516a_car_make";
        $stmtQuery .= " LEFT JOIN icaweb516a_car_model";
        $stmtQuery .= " ON icaweb516a_car_make.idCarMake = icaweb516a_car_model.carMakeID";
        $stmtQuery .= " ORDER BY idCarMake" ;

        if ($stmt = $this->dbConnection->prepare( $stmtQuery ) )
        {

		    if( $bSuccess = $stmt->execute())
            {
                $stmt->bind_result( $db_idCarMake, $db_makeName, $db_idCarModel, $db_modelName );

                $bSuccess       = TRUE;
                $idCarMakePrev  = '';
                $objMakeModels  = '';

		        while( $stmt->fetch() ) 
		        {
                    if( $idCarMakePrev != $db_idCarMake )
                    {
                        $objMakeModels              = new c_makeModelsStruct();
                        $objMakeModels->make        = $db_makeName;
                        $objMakeModels->idMake      = $db_idCarMake;
                        $idCarMakePrev              = $db_idCarMake;

                        $makeModelsCollection[]     = $objMakeModels;
                    }

                    if( ( $objMakeModels != '' ) &&  ( $db_idCarModel != '' ) )
                    {
                        $objModel                   = new c_modelStruct();
                        $objModel->idModel          = $db_idCarModel;
                        $objModel->model            = $db_modelName;

                        $objMakeModels->models[]    = $objModel;
                    }
		        } 
            }
	        $stmt->close(); 	// Free resultset 
        }

        $this->makeModelsCollection = $makeModelsCollection;

    	return $bSuccess;

	} // getAllMakeModels

    //---------------------------------------------------------------------------------------------
    // addMake
    //
    // Description: Adds a car make to the database
	//---------------------------------------------------------------------------------------------
	function addMake(   $makeName, 
                        &$strResponseData )
	{
        assert( isset( $this->dbConnection) );

        $bSuccess   = FALSE;
		$stmtQuery  = "INSERT INTO icaweb516a_car_make (name) VALUES (?)";

        if( $stmt = $this->dbConnection->prepare( $stmtQuery ) )
        {
            $makeName = $this->scrubInput( $makeName );
            $stmt->bind_param( "s", $makeName );

            $bSuccess = $stmt->execute();
            $strResponseData = $this->dbConnection->insert_id;

   	        $stmt->close(); 	// Free resultset 
        }
		return $bSuccess;
    
	} // addMake


    //---------------------------------------------------------------------------------------------
    // updateMake
    //
    // Description: Updates a car make in the database
	//---------------------------------------------------------------------------------------------
	function updateMake(    $idMake,
                            $newMakeName )
	{
        assert( isset( $this->dbConnection) );

        $bSuccess   = FALSE;
		$stmtQuery  = "UPDATE icaweb516a_car_make SET name=? WHERE idCarMake=?";

        if( $stmt = $this->dbConnection->prepare( $stmtQuery ) )
        {
            $idCarMake  = $this->scrubInput( $idMake );
            $name       = $this->scrubInput( $newMakeName );

            $stmt->bind_param("si", $newMakeName, $idCarMake );
            $bSuccess = $stmt->execute();
   	        $stmt->close(); 	// Free resultset 
        }
		return $bSuccess;
    
	} // updateMake


    //---------------------------------------------------------------------------------------------
    // deleteMake
    //
    // Description: Deletes a car make in the database
	//---------------------------------------------------------------------------------------------
	function deleteMake( $idMake )
	{
        //echo "In flagLoggedIn";
        assert( isset( $this->dbConnection) );

        $bSuccess   = FALSE;
		$stmtQuery  = "DELETE from icaweb516a_car_make WHERE idCarMake=?";

        if( $stmt = $this->dbConnection->prepare( $stmtQuery ) )
        {
            $idCarMake  = $this->scrubInput( $idMake );

            $stmt->bind_param("i", $idCarMake );
            $bSuccess = $stmt->execute();
   	        $stmt->close(); 	// Free resultset 
        }
		return $bSuccess;
    
	} // deleteMake

    //---------------------------------------------------------------------------------------------
    // deleteAllModelsForMake
    //
    // Description: Deletes all models for a car make in the database
	//---------------------------------------------------------------------------------------------
	function deleteAllModelsForMake( $idMake )
	{
        assert( isset( $this->dbConnection) );

        $bSuccess   = FALSE;
		$stmtQuery  = "DELETE FROM icaweb516a_car_model WHERE carMakeID=?";

        if( $stmt = $this->dbConnection->prepare( $stmtQuery ) )
        {
            $carMakeID  = $this->scrubInput( $idMake );

            $stmt->bind_param("i", $carMakeID );
            $bSuccess = $stmt->execute();
   	        $stmt->close(); 	// Free resultset 
        }
		return $bSuccess;
    
	} // deleteAllModelsForMake

    //---------------------------------------------------------------------------------------------
    // addModel
    //
    // Description: Adds a car model to the database
	//---------------------------------------------------------------------------------------------
	function addModel(  $idMake, 
                        $model, 
                        &$strResponseData  )
	{
        assert( isset( $this->dbConnection) );

        $bSuccess   = FALSE;
		$stmtQuery  = "INSERT INTO icaweb516a_car_model (carMakeID, name) VALUES (?, ?)";

        if( $stmt = $this->dbConnection->prepare( $stmtQuery ) )
        {
            $carMakeID = $this->scrubInput( $idMake );
            $modelName = $this->scrubInput( $model );

            $stmt->bind_param( "is", $carMakeID, $modelName );
            $bSuccess = $stmt->execute();
            $strResponseData = $this->dbConnection->insert_id;
   	        $stmt->close(); 	// Free resultset 
        }
		return $bSuccess;
    
	} // addModel


    //---------------------------------------------------------------------------------------------
    // updateModel
    //
    // Description: Updates a car model in the database
	//---------------------------------------------------------------------------------------------
	function updateModel(   $idModel,
                            $newModelName )
	{
        assert( isset( $this->dbConnection) );

        $bSuccess   = FALSE;
		$stmtQuery  = "UPDATE icaweb516a_car_model SET name=? WHERE idCarModel=?";

        if( $stmt = $this->dbConnection->prepare( $stmtQuery ) )
        {
            $idCarModel = $this->scrubInput( $idModel );
            $modelName  = $this->scrubInput( $newModelName );

            $stmt->bind_param("si", $modelName, $idCarModel );
            $bSuccess = $stmt->execute();
   	        $stmt->close(); 	// Free resultset 
        }
		return $bSuccess;
    
	} // updateModel


    //---------------------------------------------------------------------------------------------
    // deleteMake
    //
    // Description: Deletes a car model in the database
	//---------------------------------------------------------------------------------------------
	function deleteModel( $idModel )
	{
        assert( isset( $this->dbConnection) );

        $bSuccess   = FALSE;
		$stmtQuery  = "DELETE FROM icaweb516a_car_model WHERE idCarModel=?";

        if( $stmt = $this->dbConnection->prepare( $stmtQuery ) )
        {
            $idCarModel  = $this->scrubInput( $idModel );

            $stmt->bind_param("i", $idCarModel );
            $bSuccess = $stmt->execute();
   	        $stmt->close(); 	// Free resultset 
        }
		return $bSuccess;
    
	} // deleteModel

	//---------------------------------------------------------------------------------------------
    // getCarToUpdate
    //
    // Description: gets the car to be updated given either a rego or vin number
	//---------------------------------------------------------------------------------------------
	function getCarToUpdate( $objCarDetailsStructInput )
	{
        assert( isset( $this->dbConnection ) );

        $bSuccess               = FALSE;
        $makeModelsCollection   = array();

        $stmtQuery  = "SELECT idCar, modelID, icaweb516a_car_make.name as make, icaweb516a_car_model.name as model, year, price, engineSize, kilometres, transmission, fuelType, driveType, cylinders, powerkW, bodyType, seats, interiorColour, exteriorColour, doors, isNewCar, rego, vin, purchaseStatus, photoID, icaweb516a_photos.name as photoFilename";
        $stmtQuery .= " FROM icaweb516a_car_model, icaweb516a_car_make, icaweb516a_cars LEFT JOIN icaweb516a_photos ON icaweb516a_cars.photoID = icaweb516a_photos.idPhoto";
        $stmtQuery .= " WHERE rego like ? AND vin like ?";
        $stmtQuery .= "   AND icaweb516a_cars.modelID        = icaweb516a_car_model.idCarModel";
        $stmtQuery .= "   AND icaweb516a_car_model.carMakeID = icaweb516a_car_make.idCarMake";

        if ($stmt = $this->dbConnection->prepare( $stmtQuery ) )
        {
            $rego   = $this->setLikeBindParam( $objCarDetailsStructInput->rego );
            $vin    = $this->setLikeBindParam( $objCarDetailsStructInput->VIN );

            $stmt->bind_param( "ss", $rego, $vin );

		    if( $bSuccess = $stmt->execute())
            {
                $stmt->bind_result( $db_idCar, $db_modelID, $db_make, $db_model, $db_year, $db_price, $db_engineSize, $db_kilometres, $db_transmission, $db_fuelType, $db_driveType, $db_cylinders, $db_powerkW, $db_bodyType, $db_seats, $db_interiorColour, $db_exteriorColour, $db_doors, $db_isNewCar, $db_rego, $db_vin, $db_purchaseStatus, $db_photoID, $db_photoFilename );

                $bSuccess               = TRUE;
                $carToUpdateCollection  = array();

		        while( $stmt->fetch() ) 
		        {
                    $objCarDetailsStruct                    = new c_carDetailsStruct();

                    $objCarDetailsStruct->idCar             = $db_idCar;
                    $objCarDetailsStruct->modelID           = $db_modelID;
                    $objCarDetailsStruct->make              = $db_make;
                    $objCarDetailsStruct->model             = $db_model;
                    $objCarDetailsStruct->year              = $db_year;
                    $objCarDetailsStruct->price             = $db_price;
                    $objCarDetailsStruct->engineSizeCCs     = $db_engineSize;
                    $objCarDetailsStruct->kilometres        = $db_kilometres;
                    $objCarDetailsStruct->transmission      = $db_transmission;
                    $objCarDetailsStruct->fuelType          = $db_fuelType;
                    $objCarDetailsStruct->driveType         = $db_driveType;
                    $objCarDetailsStruct->cylinders         = $db_cylinders;
                    $objCarDetailsStruct->powerkW           = $db_powerkW;
                    $objCarDetailsStruct->bodyType          = $db_bodyType;
                    $objCarDetailsStruct->seats             = $db_seats; 
                    $objCarDetailsStruct->colourInterior    = $db_interiorColour;
                    $objCarDetailsStruct->colourExterior    = $db_exteriorColour;
                    $objCarDetailsStruct->doors             = $db_doors;
                    $objCarDetailsStruct->isNewCar          = $db_isNewCar;
                    $objCarDetailsStruct->rego              = $db_rego;
                    $objCarDetailsStruct->VIN               = $db_vin;
                    $objCarDetailsStruct->purchaseStatus    = $db_purchaseStatus;
                    $objCarDetailsStruct->photoID           = $db_photoID;
                    $objCarDetailsStruct->photoFilename     = ( $db_photoFilename == "" )? "" : PHOTO_DIR . $db_photoFilename;

                    $carToUpdateCollection[]                = $objCarDetailsStruct;
		        } 
            }
	        $stmt->close(); 	// Free resultset 
        }

        $this->carToUpdateCollection = $carToUpdateCollection;

    	return $bSuccess;

	} // getCarToUpdate

    

	//---------------------------------------------------------------------------------------------
    // searchForCar
    //
    // Description: does a search for a car with given search parameters in $objCarSearchStruct
	//---------------------------------------------------------------------------------------------
	function searchForCar( $objCarSearchStruct )
	{
        assert( isset( $this->dbConnection ) );

        $bSuccess   = FALSE;

        $bindTypes  = "";
        $params     = array();

        $stmtQuery  = "SELECT idCar, modelID, icaweb516a_car_make.name as make, icaweb516a_car_model.name as model, year, price, engineSize, kilometres, transmission, fuelType, driveType, cylinders, powerkW, bodyType, seats, interiorColour, exteriorColour, doors, isNewCar, rego, vin, purchaseStatus, icaweb516a_photos.name as photoFilename";
        $stmtQuery .= " FROM icaweb516a_car_model, icaweb516a_car_make,  icaweb516a_cars LEFT JOIN icaweb516a_photos ON icaweb516a_cars.photoID = icaweb516a_photos.idPhoto";
        $stmtQuery .= " WHERE icaweb516a_cars.modelID = icaweb516a_car_model.idCarModel";
        $stmtQuery .= " AND icaweb516a_car_model.carMakeID  = icaweb516a_car_make.idCarMake";

        $stmtQuery .= $this->setQueryParam( $objCarSearchStruct->idMake,            " AND icaweb516a_car_make.idCarMake= ?",        FALSE, "i", $bindTypes, $params );
        $stmtQuery .= $this->setQueryParam( $objCarSearchStruct->idModel,           " AND icaweb516a_cars.modelID= ?",              FALSE, "i", $bindTypes, $params );
        $stmtQuery .= $this->setQueryParam( $objCarSearchStruct->fromYear,          " AND icaweb516a_cars.year >= ?",               FALSE, "i", $bindTypes, $params );
        $stmtQuery .= $this->setQueryParam( $objCarSearchStruct->toYear,            " AND icaweb516a_cars.year <= ?",               FALSE, "i", $bindTypes, $params );
        $stmtQuery .= $this->setQueryParam( $objCarSearchStruct->fromPrice,         " AND icaweb516a_cars.price >= ?",              FALSE, "d", $bindTypes, $params );
        $stmtQuery .= $this->setQueryParam( $objCarSearchStruct->toPrice,           " AND icaweb516a_cars.price <= ?",              FALSE, "d", $bindTypes, $params );
        $stmtQuery .= $this->setQueryParam( $objCarSearchStruct->transmission,      " AND icaweb516a_cars.transmission = ?",        FALSE, "s", $bindTypes, $params );
        $stmtQuery .= $this->setQueryParam( $objCarSearchStruct->fuelType,          " AND icaweb516a_cars.fuelType= ?",             FALSE, "s", $bindTypes, $params );
        $stmtQuery .= $this->setQueryParam( $objCarSearchStruct->driveType,         " AND icaweb516a_cars.driveType= ?",            FALSE, "s", $bindTypes, $params );
        $stmtQuery .= $this->setQueryParam( $objCarSearchStruct->fromCylinders,     " AND icaweb516a_cars.cylinders >= ?",          FALSE, "i", $bindTypes, $params );
        $stmtQuery .= $this->setQueryParam( $objCarSearchStruct->toCylinders,       " AND icaweb516a_cars.cylinders <= ?",          FALSE, "i", $bindTypes, $params );
        $stmtQuery .= $this->setQueryParam( $objCarSearchStruct->fromKilometres,    " AND icaweb516a_cars.kilometres >= ?",         FALSE, "i", $bindTypes, $params );
        $stmtQuery .= $this->setQueryParam( $objCarSearchStruct->toKilometres,      " AND icaweb516a_cars.kilometres <= ?",         FALSE, "i", $bindTypes, $params );
        $stmtQuery .= $this->setQueryParam( $objCarSearchStruct->fromEngineSizeCCs, " AND icaweb516a_cars.engineSize >= ?",         FALSE, "i", $bindTypes, $params );
        $stmtQuery .= $this->setQueryParam( $objCarSearchStruct->toEngineSizeCCs,   " AND icaweb516a_cars.engineSize <= ?",         FALSE, "i", $bindTypes, $params );
        $stmtQuery .= $this->setQueryParam( $objCarSearchStruct->fromPowerkW,       " AND icaweb516a_cars.engineSize >= ?",         FALSE, "i", $bindTypes, $params );
        $stmtQuery .= $this->setQueryParam( $objCarSearchStruct->toPowerkW,         " AND icaweb516a_cars.engineSize <= ?",         FALSE, "i", $bindTypes, $params );
        $stmtQuery .= $this->setQueryParam( $objCarSearchStruct->bodyType,          " AND icaweb516a_cars.bodyType <= ?",           FALSE, "i", $bindTypes, $params );
        $stmtQuery .= $this->setQueryParam( $objCarSearchStruct->fromSeats,         " AND icaweb516a_cars.seats >= ?",              FALSE, "i", $bindTypes, $params );
        $stmtQuery .= $this->setQueryParam( $objCarSearchStruct->toSeats,           " AND icaweb516a_cars.seats <= ?",              FALSE, "i", $bindTypes, $params );
        $stmtQuery .= $this->setQueryParam( $objCarSearchStruct->colourInterior,    " AND icaweb516a_cars.interiorColour like ?",   TRUE,  "i", $bindTypes, $params );
        $stmtQuery .= $this->setQueryParam( $objCarSearchStruct->colourExterior,    " AND icaweb516a_cars.exteriorColour like ?",   TRUE,  "i", $bindTypes, $params );
        $stmtQuery .= $this->setQueryParam( $objCarSearchStruct->fromDoors,         " AND icaweb516a_cars.doors >= ?",              FALSE, "i", $bindTypes, $params );
        $stmtQuery .= $this->setQueryParam( $objCarSearchStruct->toDoors,           " AND icaweb516a_cars.doors <= ?",              FALSE, "i", $bindTypes, $params );
        $stmtQuery .= $this->setQueryParam( $objCarSearchStruct->isNewCar,          " AND icaweb516a_cars.isNewCar = ?",            FALSE, "i", $bindTypes, $params );
        $stmtQuery .= $this->setQueryParam( $objCarSearchStruct->rego,              " AND icaweb516a_cars.rego like ?",             TRUE,  "s", $bindTypes, $params );
        $stmtQuery .= $this->setQueryParam( $objCarSearchStruct->VIN,               " AND icaweb516a_cars.vin like ?",              TRUE,  "s", $bindTypes, $params );
        $stmtQuery .= $this->setQueryParam( $objCarSearchStruct->purchaseStatus,    " AND icaweb516a_cars.purchaseStatus = ?",      FALSE, "i", $bindTypes, $params );

        //echo $stmtQuery;
        //print_r( $params ); 

        if ($stmt = $this->dbConnection->prepare( $stmtQuery ) )
        {
            if( count($param) > 0 )
            {
                $bindNames[] = $bindTypes;
                foreach ($params as $key => $value ) 
                {
                    $bindName       = "bind" . $key;
                    $$bindName      = $value;
                    $bindNames[]    = &$$bindName;
                }
                call_user_func_array( array($stmt, "bind_param"), $bindNames );
            }

		    if( $bSuccess = $stmt->execute())
            {
                $stmt->bind_result( $db_idCar, $db_modelID, $db_make, $db_model, $db_year, $db_price, $db_engineSize, $db_kilometres, $db_transmission, $db_fuelType, $db_driveType, $db_cylinders, $db_powerkW, $db_bodyType, $db_seats, $db_interiorColour, $db_exteriorColour, $db_doors, $db_isNewCar, $db_rego, $db_vin, $db_purchaseStatus, $db_photoFilename );

                $bSuccess               = TRUE;

		        while( $stmt->fetch() ) 
		        {
                    $objCarDetailsStruct                    = new c_carDetailsStruct();

                    $objCarDetailsStruct->idCar             = $db_idCar;
                    $objCarDetailsStruct->modelID           = $db_modelID;
                    $objCarDetailsStruct->make              = $db_make;
                    $objCarDetailsStruct->model             = $db_model;
                    $objCarDetailsStruct->year              = $db_year;
                    $objCarDetailsStruct->price             = $db_price;
                    $objCarDetailsStruct->engineSizeCCs     = $db_engineSize;
                    $objCarDetailsStruct->kilometres        = $db_kilometres;
                    $objCarDetailsStruct->transmission      = $db_transmission;
                    $objCarDetailsStruct->fuelType          = $db_fuelType;
                    $objCarDetailsStruct->driveType         = $db_driveType;
                    $objCarDetailsStruct->cylinders         = $db_cylinders;
                    $objCarDetailsStruct->powerkW           = $db_powerkW;
                    $objCarDetailsStruct->bodyType          = $db_bodyType;
                    $objCarDetailsStruct->seats             = $db_seats; 
                    $objCarDetailsStruct->colourInterior    = $db_interiorColour;
                    $objCarDetailsStruct->colourExterior    = $db_exteriorColour;
                    $objCarDetailsStruct->doors             = $db_doors;
                    $objCarDetailsStruct->isNewCar          = $db_isNewCar;
                    $objCarDetailsStruct->rego              = $db_rego;
                    $objCarDetailsStruct->VIN               = $db_vin;
                    $objCarDetailsStruct->purchaseStatus    = $db_purchaseStatus;                   
                    $objCarDetailsStruct->photoFilename     = ( $db_photoFilename == "" )? "" : PHOTO_DIR . $db_photoFilename;

                    $this->searchResults[]                  = $objCarDetailsStruct;
		        } 
            }
	        $stmt->close(); 	// Free resultset 
        }

        

    	return $bSuccess;

	} // searchForCar

	//---------------------------------------------------------------------------------------------
    function setQueryParam( $objAttributeSearchParamValue,
                            $stmtQueryConditionStringToAdd,
                            $isLike,
                            $bindType,
                            &$bindTypes,
                            &$params )
    {
        $stmtQueryConditionStringToAddRet = "";
        if( $objAttributeSearchParamValue != "" )   
        { 
            $stmtQueryConditionStringToAddRet   = $stmtQueryConditionStringToAdd;
            $bindTypes                         .= $bindType; 
            $params[]                           = ( $isLike )? $this->setLikeBindParam( $objAttributeSearchParamValue ) : $this->scrubInput( $objAttributeSearchParamValue ); 
        }
        return $stmtQueryConditionStringToAddRet;

    } // setQueryParam


	//---------------------------------------------------------------------------------------------
	//---------------------------------------------------------------------------------------------
    // debugging tools
	//---------------------------------------------------------------------------------------------
    function __displayAttributes()
    {
        echo "<br>
            <br>
            ";

    } // __displayAttributes
    
} // class c_ajaxCarController

//-------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------
// Link to the outside world - the view/controller that called this ajax controller
//-------------------------------------------------------------------------------------

$strResponseStatus  = "Request Undefined";
$strResponseMessage = "";
$strResponseData    = "";


$objCarController   = new c_ajaxCarController();


// get the post variables
//
$action     = (isset($_POST['action']))?    $_POST['action']    : '';

// addCar Make & Model
//
$idMake     = (isset($_POST['idMake']))?    $_POST['idMake']    : '';
$make       = (isset($_POST['make']))?      $_POST['make']      : '';
$idModel    = (isset($_POST['idModel']))?   $_POST['idModel']   : '';
$model      = (isset($_POST['model']))?     $_POST['model']     : '';

// list & sell + update car
// 
$objCarDetailsStruct    = new c_carDetailsStruct();

$objCarDetailsStruct->modelID           = (isset($_POST['modelID']))?           $_POST['modelID']           : '';
$objCarDetailsStruct->year              = (isset($_POST['year']))?              $_POST['year']              : '';
$objCarDetailsStruct->price             = (isset($_POST['price']))?             $_POST['price']             : '';
$objCarDetailsStruct->transmission      = (isset($_POST['transmission']))?      $_POST['transmission']      : '';
$objCarDetailsStruct->fuelType          = (isset($_POST['fuelType']))?          $_POST['fuelType']          : '';
$objCarDetailsStruct->driveType         = (isset($_POST['driveType']))?         $_POST['driveType']         : '';
$objCarDetailsStruct->cylinders         = (isset($_POST['cylinders']))?         $_POST['cylinders']         : '';
$objCarDetailsStruct->kilometres        = (isset($_POST['kilometres']))?        $_POST['kilometres']        : '';
$objCarDetailsStruct->engineSizeCCs     = (isset($_POST['engineSizeCCs']))?     $_POST['engineSizeCCs']     : '';
$objCarDetailsStruct->powerkW           = (isset($_POST['powerkW']))?           $_POST['powerkW']           : '';
$objCarDetailsStruct->bodyType          = (isset($_POST['bodyType']))?          $_POST['bodyType']          : '';
$objCarDetailsStruct->seats             = (isset($_POST['seats']))?             $_POST['seats']             : '';
$objCarDetailsStruct->colourInterior    = (isset($_POST['colourInterior']))?    $_POST['colourInterior']    : '';
$objCarDetailsStruct->colourExterior    = (isset($_POST['colourExterior']))?    $_POST['colourExterior']    : '';
$objCarDetailsStruct->doors             = (isset($_POST['doors']))?             $_POST['doors']             : '';

$objCarDetailsStruct->isNewCar          = (isset($_POST['isNewCar']))?          $_POST['isNewCar']          : '';
$objCarDetailsStruct->isNewCar          = ($objCarDetailsStruct->isNewCar == 'true')? '1' : '0';

$objCarDetailsStruct->rego              = (isset($_POST['rego']))?              strtoupper($_POST['rego'])  : '';
$objCarDetailsStruct->VIN               = (isset($_POST['VIN']))?               $_POST['VIN']               : '';
$objCarDetailsStruct->idCar             = (isset($_POST['idCar']))?             $_POST['idCar']             : '';
$objCarDetailsStruct->purchaseStatus    = (isset($_POST['purchaseStatus']))?    $_POST['purchaseStatus']    : '';
$objCarDetailsStruct->photoID           = (isset($_POST['photoID']))?           $_POST['photoID']           : '';


// decide what action to take depending on the client request
//

switch ( $action )
{
    //--------------------------------
    // Add car
    //
    case "add-car-to-list-and-sell":
        if( $objCarController->addCarToListAndSell( $objCarDetailsStruct ) )    { $strResponseStatus = "Success"; }
        else                                                                    { $strResponseStatus = "Failure"; }
        break;

	case "get-all-makes-models" :	
        if( !$objCarController->getAllMakeModels() )                            { $strResponseStatus = "Failure"; }
        else
        {
            $strResponseData    = json_encode( $objCarController->makeModelsCollection );
            $strResponseStatus  = "Success";
        }
        break;

	case "add-make" :	
        if( $objCarController->addMake( $make, $strResponseData ) )             { $strResponseStatus = "Success"; }
        else                                                                    { $strResponseStatus = "Failure"; }
        break;

	case "update-make" :	
        if( $objCarController->updateMake( $idMake, $make ) )                   { $strResponseStatus = "Success"; }
        else                                                                    { $strResponseStatus = "Failure"; }
        break;

	case "delete-make" :	
        if( $objCarController->deleteMake( $idMake ) && 
            $objCarController->deleteAllModelsForMake( $idMake ) )              { $strResponseStatus = "Success"; }
        else                                                                    { $strResponseStatus = "Failure"; }
        break;

	case "add-model" :	
        if( $objCarController->addModel( $idMake, $model, $strResponseData ) )  { $strResponseStatus = "Success"; }
        else                                                                    { $strResponseStatus = "Failure"; }
        break;

	case "update-model" :	
        if( $objCarController->updateModel( $idModel, $model ) )                { $strResponseStatus = "Success"; }
        else                                                                    { $strResponseStatus = "Failure"; }
        break;

	case "delete-model" :	
        if( $objCarController->deleteModel( $idModel ) )                        { $strResponseStatus = "Success"; }
        else                                                                    { $strResponseStatus = "Failure"; }
        break;

    //--------------------------------
    // Update / Delete car
    //    
    case "get-car-to-update":
        if( !$objCarController->getCarToUpdate( $objCarDetailsStruct ) )        { $strResponseStatus = "Failure"; }      
        else
        { 
            $strResponseData    = json_encode( $objCarController->carToUpdateCollection );
            $strResponseStatus  = "Success"; 
        }
        break;

    case "update-car":
        if( $objCarController->updateCar( $objCarDetailsStruct ) )              { $strResponseStatus = "Success"; }
        else                                                                    { $strResponseStatus = "Failure"; }
        break;

    case "delete-car":
        if( $objCarController->deleteCar( $objCarDetailsStruct ) )              { $strResponseStatus = "Success"; }
        else                                                                    { $strResponseStatus = "Failure"; }
        break;


    //--------------------------------
    // Search car
    //    
    case "search-for-car":

        $objCarSearchStruct                     = new c_carSearchStruct();
                
        $objCarSearchStruct->idMake             = (isset($_POST['idMake']))?            $_POST['idMake']            : '';
        $objCarSearchStruct->idModel            = (isset($_POST['idModel']))?           $_POST['idModel']           : '';

        $objCarSearchStruct->fromYear           = (isset($_POST['fromYear']))?          $_POST['fromYear']          : '';
        $objCarSearchStruct->toYear             = (isset($_POST['toYear']))?            $_POST['toYear']            : '';

        $objCarSearchStruct->fromPrice          = (isset($_POST['fromPrice']))?         $_POST['fromPrice']         : '';
        $objCarSearchStruct->toPrice            = (isset($_POST['toPrice']))?           $_POST['toPrice']           : '';

        $objCarSearchStruct->transmission       = (isset($_POST['transmission']))?      $_POST['transmission']      : '';
        $objCarSearchStruct->fuelType           = (isset($_POST['fuelType']))?          $_POST['fuelType']          : '';
        $objCarSearchStruct->driveType          = (isset($_POST['driveType']))?         $_POST['driveType']         : '';

        $objCarSearchStruct->fromCylinders      = (isset($_POST['fromCylinders']))?     $_POST['fromCylinders']     : '';
        $objCarSearchStruct->toCylinders        = (isset($_POST['toCylinders']))?       $_POST['toCylinders']       : '';

        $objCarSearchStruct->fromKilometres     = (isset($_POST['fromKilometres']))?    $_POST['fromKilometres']    : '';
        $objCarSearchStruct->toKilometres       = (isset($_POST['toKilometres']))?      $_POST['toKilometres']      : '';

        $objCarSearchStruct->fromEngineSizeCCs  = (isset($_POST['fromEngineSizeCCs']))? $_POST['toEngineSizeCCs']   : '';
        $objCarSearchStruct->toEngineSizeCCs    = (isset($_POST['toEngineSizeCCs']))?   $_POST['toEngineSizeCCs']   : '';

        $objCarSearchStruct->fromPowerkW        = (isset($_POST['fromPowerkW']))?       $_POST['fromPowerkW']       : '';
        $objCarSearchStruct->toPowerkW          = (isset($_POST['toPowerkW']))?         $_POST['toPowerkW']         : '';

        $objCarSearchStruct->bodyType           = (isset($_POST['bodyType']))?          $_POST['bodyType']          : '';

        $objCarSearchStruct->fromSeats          = (isset($_POST['fromSeats']))?         $_POST['fromSeat']          : '';
        $objCarSearchStruct->toSeats            = (isset($_POST['toSeats']))?           $_POST['toSeats']           : '';

        $objCarSearchStruct->colourInterior     = (isset($_POST['colourInterior']))?    $_POST['colourInterior']    : '';
        $objCarSearchStruct->colourExterior     = (isset($_POST['colourExterior']))?    $_POST['colourExterior']    : '';

        $objCarSearchStruct->fromDoors          = (isset($_POST['fromDoors']))?         $_POST['fromDoors']         : '';
        $objCarSearchStruct->toDoors            = (isset($_POST['toDoors']))?           $_POST['toDoors']           : '';

        if( !isset($_POST['isNewCarType'] ))        { $objCarSearchStruct->isNewCar = ''; }
        elseif( $_POST['isNewCarType'] == 'all' )   { $objCarSearchStruct->isNewCar = ''; }
        else                                        { $objCarSearchStruct->isNewCar =       ($_POST['isNewCarType'] == 'new')? '1' : '0'; }
        
        $objCarSearchStruct->rego               = (isset($_POST['rego']))?              $_POST['rego']              : '';
        $objCarSearchStruct->VIN                = (isset($_POST['VIN']))?               $_POST['VIN']               : '';
        $objCarSearchStruct->purchaseStatus     = (isset($_POST['purchaseStatus']))?    $_POST['purchaseStatus']    : '';


        if( !$objCarController->searchForCar( $objCarSearchStruct ) )          { $strResponseStatus = "Failure"; }      
        else
        { 
            $strResponseData    = json_encode( $objCarController->searchResults );
            $strResponseStatus  = "Success"; 
        }

        break;


	default:

		$strResponseMessage = "Unknown request";		
		
} // switch


$strResponse  = "<status>{$strResponseStatus}</status>";
$strResponse .= "<message>{$strResponseMessage}</message>";
$strResponse .= "<data><![CDATA[{$strResponseData}]]></data>";
$strPackage   = "<package>{$strResponse}</package>";
echo $strPackage;


?>
