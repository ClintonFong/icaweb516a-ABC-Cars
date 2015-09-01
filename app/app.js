
var app = angular.module('appABCCarFleet', ['ngRoute', 'ui.bootstrap', 'bootstrapLightbox', 'angularFileUpload' ] );

// Use x-www-form-urlencoded Content-Type
//$httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';


// Routes
//
app.config( function( $routeProvider )
{
    $routeProvider

        // route for the home pages
        .when( '/',
        {
            templateUrl : 'app/pages/index.htm',
            controller  : 'homeController',
            css: { key:0, value : "app/pages/css/index.css" }
        })

        .when( '/homeCustomer',
        {
            templateUrl : 'app/pages/index.htm',
            controller  : 'homeController',
            css: { key:0, value : "app/pages/css/index.css" }
        })

        .when( '/homeStaff',
        {
            templateUrl : 'app/pages/homeStaff.htm',
            controller  : 'homeManagerController',
            css: [  { key:0, value : "app/pages/css/index.css" },
                    { key:1, value : "app/pages/css/homeManager.css" } ]
        })

        .when( '/homeManager',
        {
            templateUrl : 'app/pages/homeManager.htm',
            controller  : 'homeManagerController',
            css: [  { key:0, value : "app/pages/css/index.css" },
                    { key:1, value : "app/pages/css/homeManager.css" } ]
        })


        // route for the about us page
        .when( '/aboutUs',
        {
            templateUrl : 'app/pages/aboutUs.htm',
            controller  : 'aboutUsController'
        })

        // route for the our location page
        .when( '/ourLocation',
        {
            templateUrl : 'app/pages/ourLocation.htm',
            controller  : 'ourLocationController'
        })

        // route for the Enquiries page
        .when( '/enquiries',
        {
            templateUrl : 'app/pages/enquiries.htm',
            controller  : 'enquiriesController',
            css: { key:0, value : "app/pages/css/enquiry.css" }
        })

        // route for the Sign In page
        .when( '/signIn/:code',
        {
            templateUrl : 'app/pages/signIn.htm',
            controller  : 'signInController',
            css: { key:0, value : "app/pages/css/signIn.css" }
        })

        // route for the Sign Out page
        .when( '/signOut',
        {
            templateUrl : 'app/pages/signOut.htm',
            controller  : 'signOutController',
        })

        .otherwise({ redirectTo: '/' });

});

//
// directives
//

app.directive('cfExample', function() 
{
    var directive = {};

    directive.restrict = 'A';
    
    //directive.template = "My directive";
    directive.link = function( scope, element, attributes ) 
    {
        var jqueryElm = $(element[0]);
        $(jqueryElm).tabs();
    };
    
    return directive;

});

//---------------------------------------------------
app.directive('cfKeypress', function () 
{
    return function ( scope, element, attrs ) 
    {
        element.bind("keypress", function( event ) 
        {
            scope.$apply( function( event )
            {
                scope.$eval( attrs.cfKeypress );
            });

            event.preventDefault();
        });
    };
});

/**
 * Created by Zack Boman on 1/31/14.
 * http://www.zackboman.com or tennisgent@gmail.com
 
    Copyright (c) 2014 Zack Boman

    Permission is hereby granted, free of charge, to any person obtaining a copy of
    this software and associated documentation files (the "Software"), to deal in
    the Software without restriction, including without limitation the rights to
    use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
    the Software, and to permit persons to whom the Software is furnished to do so,
    subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
    FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
    COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
    IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
    CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

    Modified by Clinton to include objects with key and value where key would be the 
    positioning of the stylesheet rather than using the filename as the key which would 
    be displayed in alphabetical order rather than the order we want it
*/

app.directive('head', ['$rootScope','$compile',
    function($rootScope, $compile)
    {
        return {
            restrict    :   'E',
            link        :   function(scope, elem) 
                            {
                                var html = '<link rel="stylesheet" ng-repeat="(routeCtrl, cssUrl) in routeStyles" ng-href="{{cssUrl}}" >';
                                elem.append($compile(html)(scope));
                                scope.routeStyles = {};
                                $rootScope.$on('$routeChangeStart', function (e, next, current) 
                                {
                                    if(current && current.$$route && current.$$route.css)
                                    {
                                        if(!Array.isArray(current.$$route.css)) 
                                        {
                                            current.$$route.css = [current.$$route.css];
                                        }
                                        angular.forEach(current.$$route.css, function(sheet) { delete scope.routeStyles[sheet.key]; });
                                    }

                                    if( next && next.$$route && next.$$route.css)
                                    {
                                        if(!Array.isArray(next.$$route.css))
                                        {
                                            next.$$route.css = [next.$$route.css];
                                        }
                                        angular.forEach(next.$$route.css, function(sheet){ scope.routeStyles[sheet.key] = sheet.value; });
                                    }
                                });
                            }
        };
    }
]); // app.directive('head', ['$rootScope','$compile',

// taken and modified from http://jsfiddle.net/2ZzZB/56/
//
app.filter('startFrom', function() 
{
    return function( input, start ) 
    {
        start = Number(start); //parse to int
        return input.slice(start);
    }
});

//---------------------------------------------------------------------------
// Normal Functions / Non-Angular
//---------------------------------------------------------------------------

//---------------------------------------------------------------------------
function resetUserDetails( user )
{
    user.idUser    = '';
    user.userType  = '';
    user.firstname = '';
    user.lastname  = '';
    user.email     = '';
    user.phone     = '';

} // resetUserDetails

//---------------------------------------------------------------------------
function copyUserDetails( toUser, fromUser )
{
    toUser.idUser    = fromUser.idUser;
    toUser.userType  = fromUser.userType;
    toUser.firstname = fromUser.firstname;
    toUser.lastname  = fromUser.lastname;
    toUser.email     = fromUser.email;
    toUser.phone     = fromUser.phone;

} // copyUserDetails


//---------------------------------------------------------------------------
function displayWelcomeUser( housekeeping )
{
    if( !housekeeping.user.isLoggedIn ) { housekeeping.strWelcomeUser = ''; }
    else
    {
        var usersName               = housekeeping.user.firstname + ' ' + housekeeping.user.lastname;
        housekeeping.strWelcomeUser = (usersName.trim() == '')? '' : 'Welcome ' +  usersName;
    }
    
} // displayWelcomeUser 

//---------------------------------------------------------------------------
function removeWelcomeUser( housekeeping )
{
    housekeeping.strWelcomeUser = ''; 
    
} // removeWelcomeUser 



//---------------------------------------------------------------------------
// loadMemberMenu
//---------------------------------------------------------------------------
function loadMemberMenu( housekeeping )
{

    if( !housekeeping.user.isLoggedIn ) { loadNonMemberMenu( housekeeping );  }
    else
    {
        switch ( housekeeping.user.userType )
        {
            case UT_CUSTOMER    : loadCustomerMemberMenu( housekeeping );   break;
            case UT_STAFF       : loadStaffMemberMenu( housekeeping );      break;
            case UT_MANAGER     : loadManagerMemberMenu( housekeeping );    break;
            default:
                loadNonMemberMenu( housekeeping );    
        }
    }

} // loadMemberMenu

//---------------------------------------------------------------------------
function loadNonMemberMenu( housekeeping )
{
    var navMenuItems  = [ 
                            { "href":"#/",              "name":"Home",          "menuItemKey":"home"          },
                            { "href":"#/aboutUs",       "name":"About Us",      "menuItemKey":"aboutUs"       },
                            { "href":"#/ourLocation",   "name":"Our Location",  "menuItemKey":"ourLocation"   },
                            { "href":"#/signIn/0",      "name":"Sign In",       "menuItemKey":"signIn"        } 
                        ];

    housekeeping.navMenuItems = navMenuItems;

} // loadNonMemberMenu

//---------------------------------------------------------------------------
function loadCustomerMemberMenu( housekeeping )
{
    var navMenuItems  = [ 
                            { "href":"#/",              "name":"Home",          "menuItemKey":"homeCustomer"  },
                            { "href":"#/aboutUs",       "name":"About Us",      "menuItemKey":"aboutUs"       },
                            { "href":"#/ourLocation",   "name":"Our Location",  "menuItemKey":"ourLocation"   },
                            { "href":"#/enquiries",     "name":"Enquiries",     "menuItemKey":"enquiries"     },
                            { "href":"#/signOut",       "name":"Sign Out",      "menuItemKey":"signOut"       } 
                        ];

    housekeeping.navMenuItems = navMenuItems;

} // loadCustomerMemberMenu

//---------------------------------------------------------------------------
function loadStaffMemberMenu( housekeeping )
{
    var navMenuItems  = [ 
                            { "href":"#/homeStaff",     "name":"Home",          "menuItemKey":"homeStaff"   },
                            { "href":"#/ourLocation",   "name":"Our Location",  "menuItemKey":"ourLocation" },
                            { "href":"#/signOut",       "name":"Sign Out",      "menuItemKey":"signOut"     } 
                        ];

    housekeeping.navMenuItems = navMenuItems;

} // loadStaffMemberMenu

//---------------------------------------------------------------------------
function loadManagerMemberMenu( housekeeping )
{
    var navMenuItems  = [ 
                            { "href":"#/homeManager",   "name":"Home",          "menuItemKey":"homeManager" },
                            { "href":"#/ourLocation",   "name":"Our Location",  "menuItemKey":"ourLocation" },
                            { "href":"#/signOut",       "name":"Sign Out",      "menuItemKey":"signOut"     } 
                        ];

    housekeeping.navMenuItems = navMenuItems;

} // loadManagerMemberMenu