<?php
    
class c_generalHouseKeeping
{ 
    // Header attributes
    // -----------------
    public $arrHeaderMenuItems  = array();
    public $bSignedIn           = FALSE;
    public $username            = "";

    // Footer attributes
    // -----------------

    // Left Menu attributes
    // --------------------
    public $accessLevel         = '';
    public $leftMenuTitle       = '';
    public $selectedMenuItem    = 0;

	//---------------------------------------------------------------------------------------------
	// constructors 
	//---------------------------------------------------------------------------------------------
	function __construct( $username = '' )
	{
        $this->username = $username;

	} // __construct

	//---------------------------------------------------------------------------------------------
	// destructors
	//---------------------------------------------------------------------------------------------
	function __destruct()
	{
	} // __destruct

	//---------------------------------------------------------------------------------------------
    // Header
	//---------------------------------------------------------------------------------------------
	//---------------------------------------------------------------------------------------------

    //---------------------------------------------------------------------------------------------
    //
    // Functions
    //
    //----------------------------------    -----------------------------------------------------------
    function getTopMenuItems( $arrMenuItems )
    {
        //global $arrMenuItems;
        $strAdditionalLinks = "";

        if ( isset($arrMenuItems) )
        {
            $i = 1;
            $nLength = count( $arrMenuItems );
            foreach( $arrMenuItems as $key => $value )
            {
                if( $i == $nLength) { $strAdditionalLinks .= "<li><a href='{$value}' style='background-image:none'>{$key}</a></li>"; }
                else                { $strAdditionalLinks .= "<li><a href='{$value}'>{$key}</a></li>"; }
                $i++;
            }
        }

        return $strAdditionalLinks;

    } // getTopMenuItems


    //---------------------------------------------------------------------------------------------
    // display navigation menu above the main menu
    //
    function getTopMenu( $arrMenuItems )
    {
        $strMenu = "";

        if( count($arrMenuItems) > 0 )
        {
            $strMenu = " \n 
                <nav id='cntTopMenu'>\n
			        <ul class='menu menu-member'>" 
                        . $this->getTopMenuItems( $arrMenuItems ) . "
			        </ul>
                </nav>\n
	        ";
        }

        return $strMenu;

    } // displayTopMenu

    // End Functions

    //---------------------------------------------------------------------------------------------
    //---------------------------------------------------------------------------------------------
    //---------------------------------------------------------------------------------------------
    function displayTopSignInBar()
    {
        echo "
            <div id='cntTopSignInBar'>\n
                <form name='frmSigninBar' action='login.php' target='_self' method ='post'>\n

                    <input type='hidden' name='actionTaken' value='validate-member-login' />\n

                    <div id='cntSignInItem1' class='inlineBlock'>\n
                        <label>Sign-in Email / User ID:</label>\n
                        <input name='signinEmail' id='signinSigninEmail' type ='text' value='" . $signinEmail . "' />\n
                    </div>\n

                    <div id='cntSignInItem2' class='inlineBlock'>\n
                        <label>Password:</label>\n
                        <input name='password' id='signinBarPassword' type ='password' value='' />\n
                    </div>\n

                    <div id='cntSignInItem3' class='inlineBlock'>\n
                        <input id='btnSigninBar' type ='submit' value='Sign-in' />\n
                        <a id='aSigninBarRegister' href='login.php?register=1'>*Join</a>\n
                    </div>\n

                </form>\n
            </div>\n

            \n";

    } // displayTopSignInBar

    //---------------------------------------------------------------------------------------------
    // Display the header
    //
    function displayHeader( $selectedMenu = '' )
    {
        // display top signIn bar
        //
        if (!$this->bSignedIn) { $this->displayTopSignInBar(); }

        // display header
        echo "	
	        <div id='header'>\n
                <div id='logo'>\n
    	            <img id='imgLogo' src='images/logo-icaweb516a.png' alt='ABC Car Fleet Pty Ltd' />\n
                </div>\n
	        </div>\n
            \n";


        // Displays the Main Navigation Bar
        //
        $strSignIn  = ($this->bSignedIn)? "Sign-out"                                                 : "Sign-In";
        $strWelcome = ($this->bSignedIn)? "<div id='cntWelcomeMember'>Hello {$this->username}</div>" : "";

        // determining which menu item is selected
        $classHome          = ( $selectedMenu=='home' )? "class='selected-menu'" : "";
        $classAboutUs       = ( $selectedMenu=='aboutUs' )? "class='selected-menu'" : "";
        $classOurLocation   = ( $selectedMenu=='ourLocation' )? "class='selected-menu'" : "";
        $classEnquiries     = ( $selectedMenu=='enquiries' )? "class='selected-menu'" : "";
        $classSignIn        = ( $selectedMenu=='signIn' )? "class='selected-menu'" : "";


        echo "
            <div id='cntMainNavBar'>\n
                <nav id='cntMainNavMenu'>\n
                    <ul id='nav-menu'>\n
                        <li {$classHome}><span><a href='index.php'>Home</a></span></li>\n
                        <li {$classAboutUs}><span><a>About Us</a></span></li>\n
                        <li {$classOurLocation}><span><a>Our Location</a></span></li>\n
                        <li {$classEnquiries}><span><a>Enquiries</a></span></li>\n
                        <li {$classSignIn}><span><a href='login.php'>{$strSignIn}</a></span></li>\n
                    </ul>\n
                </nav>\n
                {$strWelcome} \n
            </div>\n
            ";

    } // displayHeader

	//---------------------------------------------------------------------------------------------
    // Footer
	//---------------------------------------------------------------------------------------------
	//---------------------------------------------------------------------------------------------
	//---------------------------------------------------------------------------------------------
    // displayFooter
	//---------------------------------------------------------------------------------------------
    function displayFooter()
    {
        echo "	
		        <div id='footer'>
			        <div id='copyright-info'>
				        <label id='copyright'>Copyright &copy; 2014</label>
				        <label id='designed-by'>Designed by: Clinton Fong</label>
				        <label id='email'>info@clintonfong.com</label>
			        </div>
		        </div>
	        ";

    } // displayFooter

	//---------------------------------------------------------------------------------------------
    // Left Menu
	//---------------------------------------------------------------------------------------------
	//---------------------------------------------------------------------------------------------
    // displayLeftMenu
	//---------------------------------------------------------------------------------------------

    function displayLeftMenu( $accessLevel,
                              $selectedMenuItem = -1 )
    {
        $this->accessLevel      = $accessLevel;
        $this->selectedMenuItem = $selectedMenuItem;


        switch( $accessLevel )
        {
            case AL_EMPLOYEE:
                return $this->displayEmployeeLeftMenu();
                break;

            case AL_PROCUREMENT_MEMBER:
                return $this->displayProcurementMemberLeftMenu();
                break;

            case AL_MANAGER:
                return $this->displayManagerLeftMenu();
                break;

            case AL_ADMIN:
                return $this->displayAdminLeftMenu();
                break;

            default:
                // unknown access level
        }    

        return "";

    } // displayLeftMenu

    //---------------------------------------------------------------------------------------------
    // displayEmployeeLeftMenu
    //---------------------------------------------------------------------------------------------
    function displayEmployeeLeftMenu( $selectedMenuItem = -1)
    {
        //echo "In displayEmployeeLeftMenu";

        $this->selectedMenuItem = ($selectedMenuItem == -1)? $this->selectedMenuItem : $selectedMenuItem;

        $leftMenu  = "<div class='menu-title'><label>Orders</label></div>\n";
        $leftMenu .= "<ul id='left-menu'>\n";

        switch( $this->selectedMenuItem )
        {        
            case 0:
                $leftMenu .= "<li><a href='employeeNewOrder.php'>Place New Order</a></li>\n
                              <li><a  href='reviewOrders.php'>Review Orders</a></li>\n";
                break;

            case 1:
                $leftMenu .= "<li class='selected-menu'><a>New Order <div>&#9658;</div></a></li>\n
                              <li><a href='reviewOrders.php'>Review Orders</a></li>\n";
                break;

            case 2:
                $leftMenu .= "<li><a href='employeeNewOrder.php'>New Order</a></li>\n
                              <li class='selected-menu'><a>Review Orders <div>&#9658;</div></a></li>\n";
                break;
        }

        $leftMenu .= "</ul>";

        echo $leftMenu;

    } // displayEmployeeLeftMenu

    //---------------------------------------------------------------------------------------------
    // displayProcurementMemberLeftMenu
    //---------------------------------------------------------------------------------------------
    function displayProcurementMemberLeftMenu( $selectedMenuItem = -1)
    {
        $this->selectedMenuItem = ($selectedMenuItem == -1)? $this->selectedMenuItem : $selectedMenuItem;

        $leftMenu  = "<div class='menu-title'><label>Orders</label></div>\n";
        $leftMenu .= "<ul id='left-menu'>\n";

        switch( $this->selectedMenuItem )
        {        
            case 0:
                $leftMenu .= "<li><a href='procurementProcessOrder.php'>Process Order</a></li>\n
                              <li><a href='reviewOrders.php'>Review Orders</a></li>\n";
                break;

            case 1:
                $leftMenu .= "<li class='selected-menu'><a>Process Order <div>&#9658;</div></a></li>\n
                              <li><a href='reviewOrders.php'>Review Orders</a></li>\n";
                break;

            case 2:
                $leftMenu .= "<li><a href='procurementProcessOrder.php'>Process Order</a></li>\n
                              <li class='selected-menu'><a>Review Orders <div>&#9658;</div></a></li>\n";
                break;
        }

        $leftMenu .= "</ul>";

        echo $leftMenu;

    } // displayProcurementMemberLeftMenu

    //---------------------------------------------------------------------------------------------
    // displayManagerLeftMenu
    //---------------------------------------------------------------------------------------------
    function displayManagerLeftMenu( $selectedMenuItem = -1)
    {
        $this->selectedMenuItem = ($selectedMenuItem == -1)? $this->selectedMenuItem : $selectedMenuItem;

        $leftMenu  = "<div class='menu-title'><label>Managers Tray</label></div>\n";
        $leftMenu .= "<ul id='left-menu'>\n";

        switch( $this->selectedMenuItem )
        {        
            case 0:
                $leftMenu .= "<li><a href='managerAuthorizeOrders.php'>Authorize Orders</a></li>\n
                              <li><a href='reviewOrders.php'>Review Orders</a></li>\n";
                break;

            case 1:
                $leftMenu .= "<li class='selected-menu'><a>Authorize Orders <div>&#9658;</div></a></li>\n
                              <li><a href='reviewOrders.php'>Review Orders</a></li>\n";
                break;

            case 2:
                $leftMenu .= "<li><a href='managerAuthorizeOrders.php'>Authorize Orders</a></li>\n
                              <li class='selected-menu'><a>Review Orders <div>&#9658;</div></a></li>\n";
                break;
        }

        $leftMenu .= "</ul>";

        echo $leftMenu;

    } // displayManagerLeftMenu


    //---------------------------------------------------------------------------------------------
    // displayAdminLeftMenu
    //---------------------------------------------------------------------------------------------
    function displayAdminLeftMenu( $selectedMenuItem = -1)
    {
        $this->selectedMenuItem = ($selectedMenuItem == -1)? $this->selectedMenuItem : $selectedMenuItem;

        $leftMenu  = "<div class='menu-title'><label>Admin Panel</label></div>\n";
        $leftMenu .= "<ul id='left-menu'>\n";

        switch( $this->selectedMenuItem )
        {        
            case 0:
                $leftMenu .= "<li><a href='adminDepartments.php'>Departments</a></li>\n
                              <li><a href='adminUsers.php'>Users</a></li>\n";
                break;

            case 1:
                $leftMenu .= "<li class='selected-menu'><a>Departments <div>&#9658;</div></a></li>\n
                              <li><a href='adminUsers.php'>Users</a></li>\n";
                break;

            case 2:
                $leftMenu .= "<li><a href='adminDepartments.php'>Departments</a></li>\n
                              <li class='selected-menu'><a>Users <div>&#9658;</div></a></li>\n";
                break;
        }

        $leftMenu .= "</ul>";

        echo $leftMenu;

    } // displayAdminLeftMenu

    //---------------------------------------------------------------------------------------------
    // displayReviewOrderLeftMenu
    // 
    //  Description: displays the appropriate left menu for appropriate user
    //---------------------------------------------------------------------------------------------
    function displayReviewOrderLeftMenu( $accessLevel )
    {
        $this->displayLeftMenu( $accessLevel, 2 );

    } // displayReviewOrderLeftMenu

} // class c_generalHouseKeeping

?>
