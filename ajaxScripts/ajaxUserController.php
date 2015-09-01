<?php
session_start();

require_once    'include/class.basicDB.inc.php';



//---------------------------------------------------------------------------------------------
class c_userStruct
{
    public $idUser          = -1;
    public $userType        = -1;
    public $firstname       = ''; 
    public $lastname        = ''; 
    public $email           = '';
    public $phone           = '';

    function __displayAttributes()
    {
        echo "idUser = {$this->idUser}<br>";
        echo "userType = {$this->userType}<br>";
        echo "firstname = {$this->firstname}<br>";
        echo "lastname = {$this->lastname}<br>";
        echo "email = {$this->email}<br>";        
        echo "phone = {$this->phone}<br>";

    } // __displayAttributes

} // c_userStruct

//---------------------------------------------------------------------------------------------
class c_ajaxUserController extends c_basicDB
{
    public $users           = array();


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
    // getUserToUpdate
    //
    // Description: gets the user to be updated 
	//---------------------------------------------------------------------------------------------
	function getUserToUpdate( $objUserStructInput )
	{
        assert( isset( $this->dbConnection ) );

        $bSuccess               = FALSE;
        $makeModelsCollection   = array();

        $stmtQuery  = "SELECT idUser, userType, firstname, lastname, email, phone";
        $stmtQuery .= " FROM icaweb516a_users";
        $stmtQuery .= " WHERE firstname like ?";
        $stmtQuery .= "   AND lastname like ?";
        $stmtQuery .= "   AND email like ?";
        $stmtQuery .= "   AND phone like ?";

        if( $objUserStructInput->userType != "" )   { $stmtQuery .= "   AND userType = ?"; }
        else                                        { $stmtQuery .= "   AND userType >=" . UT_STAFF; }

        if ($stmt = $this->dbConnection->prepare( $stmtQuery ) )
        {
            $firstname  = $this->setLikeBindParam( $objUserStructInput->firstname );
            $lastname   = $this->setLikeBindParam( $objUserStructInput->lastname );
            $email      = $this->setLikeBindParam( $objUserStructInput->email );
            $phone      = $this->setLikeBindParam( $objUserStructInput->phone );
            $userType   = $this->scrubInput( $objUserStructInput->userType );

            if( $userType != "" )   { $stmt->bind_param( "ssssi", $firstname, $lastname, $email, $phone, $userType ); }
            else                    { $stmt->bind_param( "ssss", $firstname, $lastname, $email, $phone ); } 

		    if( $bSuccess = $stmt->execute() )
            {
                $stmt->bind_result( $db_idUser, $db_userType, $db_firstname, $db_lastname, $db_email, $db_phone );

                $bSuccess               = TRUE;

		        while( $stmt->fetch() ) 
		        {
                    $objUserStruct                  = new c_userStruct();

                    $objUserStruct->idUser          = $db_idUser;
                    $objUserStruct->userType        = $db_userType;
                    $objUserStruct->firstname       = $db_firstname;
                    $objUserStruct->lastname        = $db_lastname;
                    $objUserStruct->email           = $db_email;
                    $objUserStruct->phone           = $db_phone;

                    $this->users[]                  = $objUserStruct;
		        } 
            }
	        $stmt->close(); 	// Free resultset 
        }

    	return $bSuccess;

	} // getUserToUpdate

 

    //---------------------------------------------------------------------------------------------
    // registerNewUser
    //
    // Description: register new user
	//---------------------------------------------------------------------------------------------
	function registerNewUser(   $objUserStructInput, 
                                $password,
                                &$idUser )
	{
        assert( isset( $this->dbConnection) );

        $bRegisterSuccessful = FALSE;

        if( !$this->dbConnection->connect_errno )
        {
		    $stmtQuery  = "SELECT count(*) as num_members FROM icaweb516a_users WHERE email='{$objUserStructInput->email}'";

     	    if( $resultQuery = $this->dbConnection->query( $stmtQuery ) )
            {
		        $row = $resultQuery->fetch_array( MYSQL_ASSOC );
                if ($row['num_members'] == 0)
                {
		            $stmtQuery   = "INSERT INTO icaweb516a_users (userType, firstname, lastname, email, phone, password, isLoggedIn ) VALUES ";
                    $stmtQuery  .= " (?, ?, ?, ?, ?, ?, " . LOGGED_IN . ")";

                    if( $stmt = $this->dbConnection->prepare( $stmtQuery ) )
                    {
                        $userType   = $this->scrubInput( $objUserStructInput->userType );
                        $firstname  = $this->scrubInput( $objUserStructInput->firstname );
                        $lastname   = $this->scrubInput( $objUserStructInput->lastname );
                        $email      = $this->scrubInput( $objUserStructInput->email );
                        $phone      = $this->scrubInput( $objUserStructInput->phone );

                        $firstname  = ucfirst( strtolower( $firstname ) );
                        $lastname   = ucfirst( strtolower( $lastname  ) );

                        $sha256Password = hash('sha256', $password);

                        $stmt->bind_param("isssss", $userType,
                                                    $firstname,
                                                    $lastname,
                                                    $email,
                                                    $phone,
                                                    $sha256Password );


		                $bRegisterSuccessful = ( $stmt->execute() && ($this->dbConnection->affected_rows > 0)  );
                        if( $bRegisterSuccessful )
                        {
                            // store attributes
                            //
                            $user               = new c_userStruct();

                            $user->idUser       = $this->dbConnection->insert_id;
                            $user->userType     = $userType;
                            $user->firstname    = $firstname;
                            $user->lastname     = $lastname;
                            $user->email        = $email;
                            $user->phone        = $phone;

                            $this->users[]      = $user;
                            
                        }
                    }
                }              
                $resultQuery->close();
            }
        }    

        return $bRegisterSuccessful;

	} // registerNewUser

    //---------------------------------------------------------------------------------------------
    // updateUserPersonalDetails
    //
    // Description: update user personal details
	//---------------------------------------------------------------------------------------------
	function updateUserPersonalDetails( $objUserStructInput )
    {
        //echo "updateUserPersonalDetails";
        assert( isset( $this->dbConnection) );

        $bSuccess    = FALSE;
        $stmtQuery   = "UPDATE icaweb516a_users set userType=?, firstname=?, lastname=?, email=?, phone=?";
		$stmtQuery  .= " WHERE idUser=?";

        if( $stmt = $this->dbConnection->prepare( $stmtQuery ) )
        {
            $idUser     = $this->scrubInput( $objUserStructInput->idUser );
            $userType   = $this->scrubInput( $objUserStructInput->userType );
            $firstname  = $this->scrubInput( $objUserStructInput->firstname );
            $lastname   = $this->scrubInput( $objUserStructInput->lastname );
            $email      = $this->scrubInput( $objUserStructInput->email );
            $phone      = $this->scrubInput( $objUserStructInput->phone );

            $firstname  = ucfirst( strtolower( $firstname ) );
            $lastname   = ucfirst( strtolower( $lastname  ) );

            $stmt->bind_param("issssi", $userType,
                                        $firstname,
                                        $lastname,
                                        $email,
                                        $phone,
                                        $idUser );
            $bSuccess = $stmt->execute();
   	        $stmt->close(); 	// Free resultset 
        }
		return $bSuccess;


    } // updateUserPersonalDetails


    //---------------------------------------------------------------------------------------------
    // updateUserPassword
    //
    // Description: update user personal details
	//---------------------------------------------------------------------------------------------
	function updateUserPassword(    $idUser,
                                    $oldPassword,
                                    $newPassword )
    {
        assert( isset( $this->dbConnection) );

        //echo "oldPassword={$oldPassword}";
        //echo "newPassword={$newPassword}";

        $bSuccess    = FALSE;
        $stmtQuery   = "UPDATE icaweb516a_users set password=?";
        $stmtQuery  .= " WHERE idUser=?"; // not checking for oldPassword: AND password=?"; 

        if( $stmt = $this->dbConnection->prepare( $stmtQuery ) )
        {
            $idUser     = $this->scrubInput( $objUserStructInput->idUser );

            $sha256PasswordOld = hash('sha256', $oldPassword);
            $sha256PasswordNew = hash('sha256', $newPassword);

            //$stmt->bind_param("sis", $sha256PasswordNew, $idUser, $sha256PasswordOld );
            $stmt->bind_param("si", $sha256PasswordNew, $idUser );
            $bSuccess = $stmt->execute();
   	        $stmt->close(); 	// Free resultset 

            //if( !$bSuccess && ( $oldPassword == $newPassword ) ) { $bSuccess = TRUE; }

        }

		return $bSuccess;

    } // updateUserPassword

    //---------------------------------------------------------------------------------------------
    // deleteUser
    //
    // Description: update user personal details
	//---------------------------------------------------------------------------------------------
	function deleteUser( $idUser )
    {
        //echo "updateUserPersonalDetails";
        assert( isset( $this->dbConnection) );

        $bSuccess    = FALSE;
        $stmtQuery   = "DELETE FROM icaweb516a_users WHERE idUser=?";

        if( $stmt = $this->dbConnection->prepare( $stmtQuery ) )
        {
            $idUser     = $this->scrubInput( $idUser );

            $stmt->bind_param("i", $idUser );
            $bSuccess = ($stmt->execute() && ( $stmt->affected_rows > 0 ) );
   	        $stmt->close(); 	// Free resultset 
        }

		return $bSuccess;

    } // deleteUser

} // c_ajaxUserController


//-------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------
// Link to the outside world - the view/controller that called this ajax controller
//-------------------------------------------------------------------------------------

$strResponseStatus  = "";
$strResponseMessage = "Request Undefined";
$strResponseData    = "";


$objAjaxUserController = new c_ajaxUserController();

// get the post variables
//
$action     = (isset($_POST['action']))? $_POST['action']           : '';

$idUser     = (isset($_POST['idUser']))? $_POST['idUser']           : '';
$userType   = (isset($_POST['userType']))? $_POST['userType']       : '';

$firstname  = (isset($_POST['firstname']))? $_POST['firstname']     : '';
$lastname   = (isset($_POST['lastname']))? $_POST['lastname']       : '';
$phone      = (isset($_POST['phone']))? $_POST['phone']             : '';

$email      = (isset($_POST['email']))? $_POST['email']             : '';
$password   = (isset($_POST['password']))? $_POST['password']       : '';


$objUserStructInput               = new c_userStruct();

$objUserStructInput->idUser       = $idUser;
$objUserStructInput->userType     = $userType;
$objUserStructInput->firstname    = $firstname;
$objUserStructInput->lastname     = $lastname;
$objUserStructInput->email        = $email;
$objUserStructInput->phone        = $phone;



switch ( $action )
{
 	case "get-user-to-update" :	// handles the retrieving of customers to update

        if( $objAjaxUserController->getUserToUpdate( $objUserStructInput ) )
        {
            $strResponseData    = json_encode( $objAjaxUserController->users );
            $strResponseStatus  = "Success";

            if( $userType == UT_CUSTOMER )  { $strResponseMessage = "Customers Successfully Retrieved";     }
            else                            { $strResponseMessage = "Staff Members Successfully Retrieved"; }
        }
        else
        {
            $strResponseStatus  = "Failure";
            if( $userType == UT_CUSTOMER )  { $strResponseMessage = "Failed to Successfully Retrieve Customers"; }
            else                            { $strResponseMessage = "Failed to Successfully Retrieve Staff Members"; }
        }
        break;


	case "register" :	// handles the register request
        if( $objAjaxUserController->registerNewUser( $objUserStructInput, $password, $idUser ) )
        {
            $strResponseData    = json_encode( $objAjaxUserController->users[0] );
            $strResponseStatus  = "Success";
            $strResponseMessage = "Successfully Registered";
        }
        else
        {
            $strResponseStatus  = "Failure";
            $strResponseMessage = "Register Customer Unsuccessful:: Sign-in email already taken";
        }
        break;

    case "update-user-personal-details"   :   // updates user personal details
    	if( $objAjaxUserController->updateUserPersonalDetails( $objUserStructInput ) )
        {
            $strResponseStatus  = "Success";
            $strResponseMessage = "Personal Details Updated Successfully";
        }
        else
        {
            $strResponseStatus  = "Failure";
            $strResponseMessage = "Update Unsuccessful :: Sign-in email already taken";

        }
        break;

    case "update-user-password"   :   // updates user password
    
        $oldPassword   = (isset($_POST['oldPassword']))? $_POST['oldPassword']       : '';
        $newPassword   = (isset($_POST['newPassword']))? $_POST['newPassword']       : '';

    	if( $objAjaxUserController->updateUserPassword( $idUser, $oldPassword, $newPassword ) )
        {
            $strResponseStatus  = "Success";

            if( $oldPassword == $newPassword )  {   $strResponseMessage = "Password is Unchanged";          }
            else                                {   $strResponseMessage = "Password Updated Successfully";  }
        }
        else
        {
            $strResponseStatus  = "Failure";
            $strResponseMessage = "Update Unsuccessful:: Old Password Invalid";

        }
        break;


    case "delete-user"   :   // deletes user
    	if( $objAjaxUserController->deleteUser( $idUser ) )
        {
            $strResponseStatus  = "Success";
            $strResponseMessage = "User deleted Successfully";
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

