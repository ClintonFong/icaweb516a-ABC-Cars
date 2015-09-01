<?php

session_start();

require_once    'include/class.basicDB.inc.php';

//---------------------------------------------------------------------------------------------
class c_photoStruct
{
    public $idPhoto = '';
    public $name    = '';
}


//---------------------------------------------------------------------------------------------
class c_ajaxCarPhotoController extends c_basicDB
{
    public $photos   = array();

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
    // getCarPhotos
    //
    // Description: gets car photos for a given idCar
	//---------------------------------------------------------------------------------------------
	function getCarPhotos( $idCar )
	{
        assert( isset( $this->dbConnection ) );

        $bSuccess               = FALSE;

        $stmtQuery  = "SELECT idPhoto, name FROM icaweb516a_photos WHERE carID=?";

        if ($stmt = $this->dbConnection->prepare( $stmtQuery ) )
        {
            $idCar = $this->scrubInput( $idCar );
            $stmt->bind_param( "i", $idCar );

		    if( $bSuccess = $stmt->execute())
            {
                $bSuccess       = TRUE;
                $stmt->bind_result( $db_idPhoto, $db_name );

		        while( $stmt->fetch() ) 
		        {
                    $objPhoto           = new c_photoStruct();
                    $objPhoto->idPhoto  = $db_idPhoto;
                    $objPhoto->name     = PHOTO_DIR . $db_name;

                    $this->photos[]     = $objPhoto;
		        } 
            }
	        $stmt->close(); 	// Free resultset 
        }
    	return $bSuccess;

	} // getCarPhotos

	//---------------------------------------------------------------------------------------------
    // getPhotoFilename
    //
    // Description: gets the filename of a car photo for a given idPhoto
	//---------------------------------------------------------------------------------------------
	function getPhotoFilename(  $idPhoto, 
                                &$filename )
	{
        assert( isset( $this->dbConnection ) );

        $bSuccess               = FALSE;

        $stmtQuery  = "SELECT name FROM icaweb516a_photos WHERE idPhoto=?";

        if ($stmt = $this->dbConnection->prepare( $stmtQuery ) )
        {
            $idPhoto = $this->scrubInput( $idPhoto );
            $stmt->bind_param( "i", $idPhoto );

		    if( $bSuccess = $stmt->execute())
            {
                $bSuccess       = TRUE;
                $stmt->bind_result( $db_name );
		        if( $stmt->fetch() ) { $filename = $db_name; } 
            }
	        $stmt->close(); 	// Free resultset 
        }
    	return $bSuccess;

	} // getCarPhotos


    //---------------------------------------------------------------------------------------------
    // insertPhoto
    //
    // Description: insert a photo into the database
	//---------------------------------------------------------------------------------------------
	function insertPhoto(   $idCar,
                            $fileName,
                            &$idPhoto )
	{
        assert( isset( $this->dbConnection) );

        $bSuccess   = FALSE;
		$stmtQuery  = "INSERT INTO icaweb516a_photos (carID, name) VALUES (?, ?)";

        if( $stmt = $this->dbConnection->prepare( $stmtQuery ) )
        {
            $idCar      = $this->scrubInput( $idCar );
            $fileName   = $this->scrubInput( $fileName );

            $stmt->bind_param("is", $idCar, $fileName );
            $bSuccess   = ( $stmt->execute() && ( $stmt->affected_rows == 1 ) );
            $idPhoto    = $this->dbConnection->insert_id;
   	        $stmt->close(); 	// Free resultset 
        }
		return $bSuccess;
    
	} // insertPhoto

    //---------------------------------------------------------------------------------------------
    // deletePhoto
    //
    // Description: deletes a photo from the database
	//---------------------------------------------------------------------------------------------
	function deletePhoto( $idPhoto )
	{
        assert( isset( $this->dbConnection) );

        $bSuccess   = FALSE;
		$stmtQuery  = "DELETE FROM icaweb516a_photos WHERE idPhoto=?";

        if( $stmt = $this->dbConnection->prepare( $stmtQuery ) )
        {
            $idPhoto      = $this->scrubInput( $idPhoto );
            $stmt->bind_param( "i", $idPhoto );
            $bSuccess = $stmt->execute();
   	        $stmt->close(); 	// Free resultset 
        }
		return $bSuccess;
    
	} // deletePhoto

    //---------------------------------------------------------------------------------------------
    // updateCarPrimaryPhotoID
    //
    // Description: deletes a photo from the database
	//---------------------------------------------------------------------------------------------
	function updateCarPrimaryPhotoID(   $idCar, 
                                        $idPhoto )
	{
        assert( isset( $this->dbConnection) );

        $bSuccess   = FALSE;
		$stmtQuery  = "UPDATE icaweb516a_cars SET photoID=? WHERE idCar=?";

        if( $stmt = $this->dbConnection->prepare( $stmtQuery ) )
        {
            $idCar      = $this->scrubInput( $idCar );
            $idPhoto    = $this->scrubInput( $idPhoto );

            $stmt->bind_param( "ii", $idPhoto, $idCar );
            $bSuccess = $stmt->execute();
   	        $stmt->close(); 	// Free resultset 
        }
		return $bSuccess;
    
	} // deletePhoto


} // class c_ajaxCarPhotoController extends c_basicDB

//---------------------------------------------------------------------------------------------

$strResponseStatus  = "Request Undefined";
$strResponseMessage = "";
$strResponseData    = "";


$idCar      = (isset($_POST['idCar']))?     $_POST['idCar']     : '';
$action     = (isset($_POST['action']))?    $_POST['action']    : '';
$idPhoto    = (isset($_POST['idPhoto']))?   $_POST['idPhoto']   : '';
$isPrimary  = (isset($_POST['isPrimary']))? $_POST['isPrimary'] : '';

switch( $action )
{
    case "get-photos":
        $objCarPhotoController  = new c_ajaxCarPhotoController();
        $strResponseStatus      = ( $objCarPhotoController->getCarPhotos( $idCar ) )? "Success" : "Failure";
        $strResponseData        = json_encode( $objCarPhotoController->photos );
        break;

    case "insert": 
        if( !isset($_FILES['file']) )
        {
            $strResponseStatus  = "Failure";
            $strResponseMessage = "No File";
        }
        elseif( !checkUploadPhotoForErrors( $strResponseMessage ) )
        {
            $strResponseStatus = "Failure";
        }
        else
        {
            $fileName   = $_FILES['file']['name'];
            $fileSize   = $_FILES['file']['size'];
            $fileTmp    = $_FILES['file']['tmp_name'];
            $fileType   = $_FILES['file']['type'];   

            // create file name   
            $fileExt            = strtolower( pathinfo( $fileName, PATHINFO_EXTENSION ) );
            $targetFileName     = $idCar . "_" . time() . "." . $fileExt; 
            $fileDestination    = "../" . PHOTO_DIR . $targetFileName;

            if( move_uploaded_file( $fileTmp, $fileDestination ) )
            {
                chmod( $fileDestination, 0755 );
            }
            //echo "|targetFileName={$targetFileName}|, |idCar={$idCar}|";
            $objCarPhotoController  = new c_ajaxCarPhotoController();
            $strResponseStatus      = ($objCarPhotoController->insertPhoto( $idCar, $targetFileName, $idPhoto ))? "Success" : "Failure";
            
            // update primary photo field of icaweb516a_cars table with newly inserted photo 
            if( $isPrimary && ( $strResponseStatus == "Success" ) )   
            { 
                $strResponseStatus  = ( $objCarPhotoController->updateCarPrimaryPhotoID( $idCar, $idPhoto ) )? "Success" : "Failure"; 

                $objPhoto = new c_photoStruct();
                $objPhoto->idPhoto  = $idPhoto;
                $objPhoto->name     = PHOTO_DIR . $targetFileName;

                $strResponseData    = json_encode( $objPhoto );  ; // let the client know of the new id and filename of the newly inserted photo
            }
        }
        break; // case insert

    case "delete":
        $objCarPhotoController  = new c_ajaxCarPhotoController();
        if( $objCarPhotoController->getPhotoFilename( $idPhoto, $filename ) )
        {
            if( $objCarPhotoController->deletePhoto( $idPhoto ) )
            {
                $filePath = "../" . PHOTO_DIR . $filename; 
                $strResponseStatus =  ( unlink( $filePath ) )? "Success" : "Failure";   
            }
        }
        break;
  

} // switch



$strResponse  = "<status>{$strResponseStatus}</status>";
$strResponse .= "<message>{$strResponseMessage}</message>";
$strResponse .= "<data><![CDATA[{$strResponseData}]]></data>";
$strPackage   = "<package>{$strResponse}</package>";
echo $strPackage;

//------------------------------------------------------------------------------------------------------
function checkUploadPhotoForErrors( &$strResponseMessage )
{
	$bIsOk = TRUE;
	
	if (!isset( $_FILES['file'] ))
	{
		$bIsOk = FALSE;
		$strResponseMessage = "The uploaded file error...please try again";
	}
	elseif ($_FILES['file']['error'] == UPLOAD_ERR_INI_SIZE)
	{
		$bIsOk= FALSE;
		$strResponseMessage = "The uploaded file  exceeds the upload_max_filesize directive in php.ini";
	}
	elseif ($_FILES['file']['error'] == UPLOAD_ERR_FORM_SIZE)
	{
		$bIsOk= FALSE;
		$strResponseMessage = "The uploaded file exceeds the maximum suggested file size of 1 megabyte.";
	}
	elseif ($_FILES['file']['error'] == UPLOAD_ERR_PARTIAL)
	{
		$bIsOk= FALSE;
		$strResponseMessage = "The uploaded file was partially uploaded";
	}
	elseif ($_FILES['file']['error'] == UPLOAD_ERR_NO_FILE)
	{
		$bIsOk= FALSE;
		$strResponseMessage = "No File was uploaded";
	}
	elseif ($_FILES['file']['error'] == UPLOAD_ERR_NO_TMP_DIR)
	{
		$bIsOk= FALSE;
		$strResponseMessage = "Missing temporary folder.";
	}
	
	return $bIsOk;
			
} // checkUploadPhotoForErrors


?>

