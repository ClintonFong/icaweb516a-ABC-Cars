<?php
//header("Content-type: text/xml");

require_once    'include/class.basicDB.inc.php';
require_once    'lib/PHPMailer_5.2.4/class.phpmailer.php';

class c_ajaxForgotPasswordController extends c_basicDB
{
    private $strNewPassword = "";


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


    // --------------------------------------------------------------------------------------------------------------
    // resetPasswordDB
    // --------------------------------------------------------------------------------------------------------------
    function resetPasswordDB( $email,
                              &$strResponseStatus,
                              &$strResponseMessage )
    {
        assert( isset( $email) );
        assert( isset( $this->dbConnection) );
    

        $strResponseStatus  = "Unsuccessful";
        $strResponseMessage = "Reset password unsuccessful";
    

        if( !$dbConnection->connect_errno )
        {
            $this->strNewPassword = generateTemporaryPassword();
            $sha256Password =  hash('sha256', $this->strNewPassword);

		    $stmtQuery      = "UPDATE icaweb516a_users SET password='{$sha256Password}' WHERE email=?";

            if( $stmt = $dbConnection->prepare( $stmtQuery ) )
            {
                $email = $this->scrubInput( $email );
                $stmt->bind_param('s', $email );

		        $bSuccess = $stmt->execute();

                if( $bSuccess && ($stmt->affected_rows > 0) )
                { 
                    $strResponseStatus  = "Success"; 
                    $strResponseMessage = "Password has been reset to a temporary password.";
                }
                $stmt->close();
            }
	    }

        return ( $strResponseStatus == "Success" );

    } // resetPasswordDB


    // --------------------------------------------------------------------------------------------------------------
    // --------------------------------------------------------------------------------------------------------------
    // sendEmailPasswordChanged
    // --------------------------------------------------------------------------------------------------------------
    function sendEmailPasswordChanged( $email,
                                       &$strResponseStatus,
                                       &$strResponseMessage )
    {
        assert( isset( $email) );
    
        $bGetNameSuccess    = FALSE;
        $strResponseStatus  = "Unsuccessful";
        $strName            = $this->getMemberNameDB( $email, $bGetNameSuccess );
        $strResponseMessage = "Sending reset email notification for new password unsuccessful.";

        if( $bGetNameSuccess )
        {

            $mail             = new PHPMailer();

            //$mail->IsSMTP();                                            // telling the class to use SMTP
            $mail->SMTPDebug    = 0;                                    // enables SMTP debug information (for testing)
            //$mail->SMTPAuth     = TRUE;                                 // enable SMTP authentication
            //$mail->SMTPSecure   = "ssl";                                // sets the prefix to the server
            //$mail->Host         = "smtp.gmail.com";                     // sets GMAIL as the SMTP server
            //$mail->Port         = 465;                                  // set the SMTP port for the GMAIL server
            $mail->IsHTML(TRUE);

            // gmail account to use to send the email
            //$mail->Username     = "fongclinton.mail.gateway@gmail.com"; 
            //$mail->Password     = "Password001";  

            //$mail->SetFrom("fongclinton.mail.gateway@gmail.com");
            //$mail->AddAddress("Sharon.Carrasco@evocca.com.au", "Sharon Carrasco");
            $mail->AddAddress( $email, $strName );
            //$mail->AddCC("info@clintonfong.com", "Clinton Fong");

            $mail->Subject  = "ABC Car Fleet - Password reset";
            $msg            = "Dear {$strName},<br><br>";
	        $msg           .= "As requested, your new Temporary Password for Sign-in on the 'ABC Car Fleet' website is <span style='color:#78655F'>{$this->strNewPassword}</span><br>";
	        $msg           .= "Please change this password as soon as possible when you next Sign-in.<br><br>";
            $msg           .= "Your friendly support team at ABC Car Fleet Pty Ltd";

            $mail->Body    = $msg;

	        // Mail it
            if( $mail->Send() )
            {
                $strResponseStatus  = "Success";
                $strResponseMessage = "Email with new password has been sent to you.";
            }
            else
            {
                //$strResult         .= " Mailer error: {$mail->ErrorInfo}";
            }
        }
		
        $strResponseData .= "<br>{$strResult}";

        return ( $strResponseStatus == "Success" );

    } // sendEmailPasswordChanged

    // --------------------------------------------------------------------------------------------------------------
    // getMemberNameDB
    // --------------------------------------------------------------------------------------------------------------
    function getMemberNameDB( $email, 
                              &$bSuccess )
    {
        assert( isset( $email) );
        assert( isset( $this->dbConnection) );

        $strName        = "";
        $bSuccess       = FALSE;

        if( !$this->dbConnection->connect_errno )
        {
		    $stmtQuery  = "SELECT firstname, lastname FROM icaweb516a_users WHERE email=?";

		    if( $stmt = $this->dbConnection->prepare( $stmtQuery ) )
            {
                $email = $this->scrubInput( $email );
                $stmt->bind_param('s', $email);

                if( $stmt->execute() )
                {
                    $stmt->bind_result( $db_firstname, $db_lastname );
		            if( $stmt->fetch() ) 
		            {
                        $strName = $db_firstname . " " . $db_lastname;
                        $bSuccess = TRUE; 
		            } 
                }
		        $stmt->close(); 	// Free resultset 
            }
	    }

        return $strName;

    } // getMemberNameDB

    // --------------------------------------------------------------------------------------------------------------
    // generateTemporaryPassword
    // --------------------------------------------------------------------------------------------------------------
    function generateTemporaryPassword() 
    {
        $alphabet       = "abcdefghijklmnopqrstuwxyzABCDEFGHIJKLMNOPQRSTUWXYZ0123456789";
        $alphaLength    = strlen( $alphabet ) - 1;
        $newPassword    = "";

        for ($i = 0; $i < TEMPORARY_PASSWORD_LENGTH; $i++) 
        {
            $n = rand(0, $alphaLength);
            $newPassword .= $alphabet[$n];
        }
        return $newPassword;

    } // generateTemporaryPassword


} // class c_ajaxForgotPasswordController

//-------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------
// Link to the outside world - the view/controller that called this ajax controller
//-------------------------------------------------------------------------------------

$strResponseStatus  = "Request Undefined";
$strResponseMessage = "";


$objAjaxForgotPasswordController = new c_ajaxForgotPasswordController();

// decide what action to take depending on the client request
//

if ( isset( $_REQUEST['action'] ) )
{	

    switch ($_REQUEST['action'])
    {
	    case "forgot-password" :	// handles the forgot password request
            if ( isset($_REQUEST['email'] ) )
            {
                if( $objAjaxForgotPasswordController->resetPasswordDB( $_REQUEST['email'], $strResponseStatus, $strResponseMessage ) )
                {
                    $objAjaxForgotPasswordController->sendEmailPasswordChanged( $_REQUEST['email'], $strResponseStatus, $strResponseMessage );
                }

                if ( $strResponseMessage != 'Success' ) { $strResponseData .= "<br>Please contact us to resolve this matter"; }
            }
            break;

	    default:
		    $strResponseStatus = "Unknown request";		
		
    } // switch


}


$strResponse  = "<status>{$strResponseStatus}</status>";
$strResponse  = "<message>{$strResponseMessage}</message>";
$strPackage   = "<package>{$strResponse}</package>";
echo $strPackage;


?>