<?php

session_start();

require_once    'include/class.basicDB.inc.php';


//---------------------------------------------------------------------------------------------
class c_enquiryStruct
{
    public $idEnquiry       = -1;
    public $idUser          = -1;
    public $dateLodged      = "";
    public $rego            = -1;
    public $enquiry         = ''; 
    public $status          = -1;

    // details of the customer that made the enquiry
    //
    public $firstname       = "";
    public $lastname        = "";
    public $email           = "";
    public $phone           = "";


} // c_enquiryStruct


//---------------------------------------------------------------------------------------------
class c_ajaxEnquiriesController extends c_basicDB
{
    public $enquiries           = array();


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
    // geEnquiries
    //
    // Description: gets the enquiries 
	//---------------------------------------------------------------------------------------------
	function getEnquiries( $objEnquiryStructInput )
	{
        assert( isset( $this->dbConnection ) );

        $bSuccess               = FALSE;
        $makeModelsCollection   = array();

        $stmtQuery  = "SELECT idEnquiry, userID, dateLodged, rego, enquiry, status, firstname, lastname, email, phone";
        $stmtQuery .= " FROM icaweb516a_enquiries, icaweb516a_users";
        $stmtQuery .= " WHERE icaweb516a_enquiries.userID = icaweb516a_users.idUser";
        $stmtQuery .= "   AND firstname like ?";
        $stmtQuery .= "   AND lastname like ?";
        $stmtQuery .= "   AND email like ?";
        $stmtQuery .= "   AND phone like ?";
        $stmtQuery .= ( $objEnquiryStructInput->dateFrom == "" )? "" : " AND dateLodged >= ?";
        $stmtQuery .= ( $objEnquiryStructInput->dateTo == "" )? "" : " AND dateLodged <= ?";
        $stmtQuery .= " ORDER BY status ASC";

        if ($stmt = $this->dbConnection->prepare( $stmtQuery ) )
        {

            $firstname  = $this->setLikeBindParam( $objEnquiryStructInput->firstname );
            $lastname   = $this->setLikeBindParam( $objEnquiryStructInput->lastname );
            $email      = $this->setLikeBindParam( $objEnquiryStructInput->email );
            $phone      = $this->setLikeBindParam( $objEnquiryStructInput->phone );
            $dateFrom   = $this->scrubInput( $objEnquiryStructInput->dateFrom );
            $dateTo     = $this->scrubInput( $objEnquiryStructInput->dateTo );

            //echo "dateFrom={$dateFrom}";
            //echo "dateTo={$dateTo}";

            if( ( $dateFrom == "" ) && ( $dateTo == "" ) )      { $stmt->bind_param( "ssss", $firstname, $lastname, $email, $phone );                       }
            elseif( ( $dateFrom != "" ) && ( $dateTo != "" ) )  { $stmt->bind_param( "ssssss", $firstname, $lastname, $email, $phone, $dateFrom, $dateTo ); }
            elseif( $dateFrom != "" )                           { $stmt->bind_param( "sssss", $firstname, $lastname, $email, $phone, $dateFrom );           }
            else                                                { $stmt->bind_param( "sssss", $firstname, $lastname, $email, $phone, $dateTo );             }

           

		    if( $bSuccess = $stmt->execute() )
            {
                $stmt->bind_result( $db_idEnquiry, $db_idUser, $db_dateLodged, $db_rego, $db_enquiry, $db_status, $db_firstname, $db_lastname, $db_email, $db_phone );

                $bSuccess               = TRUE;

		        while( $stmt->fetch() ) 
		        {
                    $objEnquiryStruct                  = new c_enquiryStruct();

                    $objEnquiryStruct->idEnquiry       = $db_idEnquiry;
                    $objEnquiryStruct->idUser          = $db_idUser;
                    $objEnquiryStruct->dateLodged      = $db_dateLodged;
                    $objEnquiryStruct->rego            = $db_rego;
                    $objEnquiryStruct->enquiry         = $db_enquiry;
                    $objEnquiryStruct->status          = $db_status;
                    $objEnquiryStruct->firstname       = $db_firstname;
                    $objEnquiryStruct->lastname        = $db_lastname;
                    $objEnquiryStruct->email           = $db_email;
                    $objEnquiryStruct->phone           = $db_phone;

                    $this->enquiries[]                 = $objEnquiryStruct;
		        } 
            }
	        $stmt->close(); 	// Free resultset 
        }

    	return $bSuccess;


    } // getEnquiries

    //---------------------------------------------------------------------------------------------
    // lodgeEnquiry
    //
    // Description: register new user
	//---------------------------------------------------------------------------------------------
	function lodgeEnquiry( $objEnquiryStructInput )
	{
        assert( isset( $this->dbConnection) );

        $bSuccess    = FALSE;
        $stmtQuery   = "INSERT INTO icaweb516a_enquiries ( userID, rego, enquiry, dateLodged, status )";
        $stmtQuery  .= " VALUES ( ?, ?, ?, now()," . ES_LODGED . ")";

        if( $stmt = $this->dbConnection->prepare( $stmtQuery ) )
        {
            $idUser     = $this->scrubInput( $objEnquiryStructInput->idUser );
            $rego       = $this->scrubInput( $objEnquiryStructInput->rego );
            $enquiry    = $this->scrubInput( $objEnquiryStructInput->enquiry );

            $stmt->bind_param("iss", $idUser, $rego, $enquiry );
            $bSuccess = ($stmt->execute() && ( $stmt->affected_rows > 0 ) );
   	        $stmt->close(); 	// Free resultset 
        }
		return $bSuccess;

	} // lodgeEnquiry

    //---------------------------------------------------------------------------------------------
    // updateEnquiryStatus
    //
    // Description: update enquiry status
	//---------------------------------------------------------------------------------------------
	function updateEnquiryStatus(   $idEnquiry,
                                    $newStatus )
    {
        assert( isset( $this->dbConnection) );

        //echo "oldPassword={$oldPassword}";
        //echo "newPassword={$newPassword}";

        $bSuccess    = FALSE;
        $stmtQuery   = "UPDATE icaweb516a_enquiries set status=? WHERE idEnquiry=?";

        if( $stmt = $this->dbConnection->prepare( $stmtQuery ) )
        {
            $idEnquiry     = $this->scrubInput( $idEnquiry );
            $newStatus     = $this->scrubInput( $newStatus );

            $stmt->bind_param("ii", $newStatus, $idEnquiry );
            $bSuccess = ($stmt->execute() && ( $stmt->affected_rows > 0 ) );
   	        $stmt->close(); 	// Free resultset 
        }

		return $bSuccess;

    } // updateEnquiryStatus


    //---------------------------------------------------------------------------------------------
    // deleteEnquiry
    //
    // Description: deletes an enquiry
	//---------------------------------------------------------------------------------------------
	function deleteEnquiry( $idEnquiry )
    {
        assert( isset( $this->dbConnection) );

        $bSuccess    = FALSE;
        $stmtQuery   = "DELETE FROM icaweb516a_enquiries WHERE idEnquiry=?";

        if( $stmt = $this->dbConnection->prepare( $stmtQuery ) )
        {
            $idEnquiry     = $this->scrubInput( $idEnquiry );

            $stmt->bind_param("i", $idEnquiry );
            $bSuccess = ($stmt->execute() && ( $stmt->affected_rows > 0 ) );
   	        $stmt->close(); 	// Free resultset 
        }

		return $bSuccess;

    } // deleteEnquiry


} // c_ajaxEnquiriesController


//-------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------
// Link to the outside world - the view/controller that called this ajax controller
//-------------------------------------------------------------------------------------

$strResponseStatus  = "";
$strResponseMessage = "Request Undefined";
$strResponseData    = "";


$objAjaxEnquiriesController = new c_ajaxEnquiriesController();

// get the post variables
//
$action     = (isset($_POST['action']))? $_POST['action']           : '';

$idEnquiry  = (isset($_POST['idEnquiry']))? $_POST['idEnquiry']     : '';
$idUser     = (isset($_POST['idUser']))? $_POST['idUser']           : '';
$rego       = (isset($_POST['rego']))? $_POST['rego']               : '';
$enquiry    = (isset($_POST['enquiry']))? $_POST['enquiry']         : '';
$newStatus  = (isset($_POST['newStatus']))? $_POST['newStatus']     : '';

// search parameters for enquiry
//
$firstname  = (isset($_POST['firstname']))? $_POST['firstname']     : '';
$lastname   = (isset($_POST['lastname']))? $_POST['lastname']       : '';
$email      = (isset($_POST['email']))? $_POST['email']             : '';
$phone      = (isset($_POST['phone']))? $_POST['phone']             : '';

$dateFrom   = (isset($_POST['dateFrom']))? $_POST['dateFrom']       : '';
$dateTo     = (isset($_POST['dateTo']))? $_POST['dateTo']           : '';


// create the enquiry object
$objEnquiryStructInput    = new c_enquiryStruct();

$objEnquiryStructInput->idUser    = $idUser;
$objEnquiryStructInput->rego      = $rego;
$objEnquiryStructInput->enquiry   = $enquiry;

$objEnquiryStructInput->firstname   = $firstname;
$objEnquiryStructInput->lastname    = $lastname;
$objEnquiryStructInput->email       = $email;
$objEnquiryStructInput->phone       = $phone;

$objEnquiryStructInput->dateFrom    = $dateFrom;
$objEnquiryStructInput->dateTo      = $dateTo;

switch ( $action )
{
    case "get-enquiries"   :   // gets enquiries

    	if( $objAjaxEnquiriesController->getEnquiries( $objEnquiryStructInput ) )
        {
            $strResponseData    = json_encode( $objAjaxEnquiriesController->enquiries );
            $strResponseStatus  = "Success";
            $strResponseMessage = "Retrieved Enquiries Successfully";
        }
        else
        {
            $strResponseStatus  = "Failure";
            $strResponseMessage = "Unsuccessful in Retrieving of Enquiries";
        }
        break;

    case "lodge-enquiry"   :   // lodges enquiry

    	if( $objAjaxEnquiriesController->lodgeEnquiry( $objEnquiryStructInput ) )
        {
            $strResponseStatus  = "Success";
            $strResponseMessage = "Enquiry lodged Successfully";
        }
        else
        {
            $strResponseStatus  = "Failure";
            $strResponseMessage = "Unsuccessful in lodging of enquiry";
        }
        break;

    case "update-enquiry-status" : // update enquiry status
    	if( $objAjaxEnquiriesController->updateEnquiryStatus( $idEnquiry, $newStatus ) )
        {
            $strResponseStatus  = "Success";
            $strResponseMessage = "New Enquiry Status Updated Successfully";
        }
        else
        {
            $strResponseStatus  = "Failure";
            $strResponseMessage = "Update of Status Remains Unchanged. New Status was the same as the Old Status.";

        }
        break;

    case "delete-enquiry"   :   // delete enquiry
    	if( $objAjaxEnquiriesController->deleteEnquiry( $idEnquiry ) )
        {
            $strResponseStatus  = "Success";
            $strResponseMessage = "Enquiry deleted Successfully";
        }
        else
        {
            $strResponseStatus  = "Failure";
            $strResponseMessage = "Delete Unsuccessful";
        }
        break;
}

$strResponse  = "<status>{$strResponseStatus}</status>";
$strResponse .= "<message>{$strResponseMessage}</message>";
$strResponse .= "<data><![CDATA[{$strResponseData}]]></data>";
$strPackage   = "<package>{$strResponse}</package>";
echo $strPackage;


?>

