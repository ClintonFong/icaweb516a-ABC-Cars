// --------------------------------------
// Constants
//
// user types
// ----------
var UT_CUSTOMER =  0;
var UT_STAFF    =  5;
var UT_MANAGER  =  9;


// enquiry status
// ----------------------
var ES_LODGED       = 0;
var ES_PROCESSING   = 1;
var ES_CLOSED       = 2;


// purchase status
// ---------------
var PS_AVAILABLE    = 0;
var PS_DEPOSIT_PAID = 1;
var PS_SOLD         = 2;



//---------------------------------------------------------------------------------------------
// isValidNormalCharKey
//
// Description: allows only valid normal character keys input 0-9, a-z, and A-Z
//---------------------------------------------------------------------------------------------
function isValidNormalCharKey(evt)
{
    var charCode = (evt.which) ? evt.which : event.keyCode;

    if (  (charCode ==  8)  ||                          // backspace
          (charCode ==  32) ||                          // space
         ((charCode  >= 48) && (charCode <= 57)) ||     // 0-9
         ((charCode  >= 65) && (charCode <= 90)) ||     // A-Z
         ((charCode  >= 97) && (charCode <= 122))       // a-z
         )
    {
        return true;
    }

    return false;

} // isValidNormalCharKey


//---------------------------------------------------------------------------------------------
// isIntegerKey
//
// Description: allows only integer input
//---------------------------------------------------------------------------------------------
function isIntegerKey(evt)
{
    var charCode = (evt.which) ? evt.which : event.keyCode;

    if (  (charCode !=  8) && 
         ((charCode  < 48) || (charCode > 57)) )
    {
        return false;
    }

    return true;

} // isIntegerKey


//---------------------------------------------------------------------------------------------
// isFloatKey
//
// Description: allows only float input
//---------------------------------------------------------------------------------------------
function isFloatKey(evt)
{
    var charCode = (evt.which) ? evt.which : event.keyCode;

    // check for extra decimal point
    //
    if( charCode == 46 ) // decimal point
    {
        if ( !(evt.target.value.indexOf('.') === -1) )
        { 
            return false;   // already found a decimal 
        }
    }

    // check if valid keystroke
    //
    if (  (charCode != 46) && (charCode > 31) &&
         ((charCode  < 48) || (charCode > 57) ) )
    {
        return false;
    }

    return true;

} // isFloatKey



//---------------------------------------------------------------------------------------------
// isMoneyKey
//
// Description: allows only float input
//---------------------------------------------------------------------------------------------
function isMoneyKey(evt)
{
    var charCode = (evt.which) ? evt.which : event.keyCode;

    // check for extra decimal point
    //
    if( charCode == 46 ) // decimal point
    {
        if ( !(evt.target.value.indexOf('.') === -1) )
        { 
            return false;   // already found a decimal 
        }
    }

    // check if valid keystroke
    //
    if (  (charCode != 46) && (charCode > 31) &&
         ((charCode  < 48) || (charCode > 57) ) )
    {
        return false;
    }

    // check for no more than 2 decimal places
    //
    if( charCode != 8 ) // only valid key here is backspace
    {
        integer     = evt.target.value.split('.')[0];
        mantissa    = evt.target.value.split('.')[1];

        if (typeof mantissa === 'undefined')    { mantissa = ''; }
        if (mantissa.length >= 2)               { return false;  }  // already exceeded number of decimal places
    }
        
    return true;

} // isMoneyKey



//---------------------------------------------------------------------------------------------
// isPhoneNumberKey
//
// Description: allows only phone number input
//---------------------------------------------------------------------------------------------
function isPhoneNumberKey(evt)
{
    var charCode = (evt.which) ? evt.which : event.keyCode;
    
    if( charCode != 8 ) // only valid key here is backspace
    {
        if (  (charCode != 40) && (charCode > 31) && (charCode != 41) && (charCode != 43) && (charCode != 32) && 
             ((charCode  < 48) || (charCode > 57) ) )
        {
            return false;
        }
    }
    return true;

} // isPhoneNumberKey

//---------------------------------------------------------------------------------------------
// isPhoneExtKey
//
// Description: allows only phone number input
//---------------------------------------------------------------------------------------------
function isPhoneExtKey(evt)
{
    var charCode = (evt.which) ? evt.which : event.keyCode;

    if( charCode != 8 ) // only valid key here is backspace
    {

        if (  (charCode != 40) && (charCode > 31) && (charCode != 41) && (charCode != 43) && (charCode != 32) && 
             ((charCode  < 48) || (charCode > 57) ) )
        {
            return false;
        }

        // check if 5 or less characters
        if( evt.target.value.length >= PHONE_EXT_MAX_LENGTH )
        {
            return false; 
        }
    }

    return true;

} // isPhoneExtKey

//---------------------------------------------------------------------------------------------
function truncatePhoneExt( phoneNo ) 
{
    return phoneNo.substring(0, Math.min(PHONE_EXT_MAX_LENGTH, phoneNo.length));

} // truncatePhoneExt

//---------------------------------------------------------------------------------------------
// Checks
//---------------------------------------
function isValidEmail( email )
{
    var regex = /^([a-zA-Z0-9_.+-])+\@([a-zA-Z0-9-])+(\.([a-zA-Z0-9-])+)*(\.[a-zA-Z0-9]{2,4})*$/;
    return regex.test(email);
    //return true;

} // isValidEmail


//---------------------------------------
function isPasswordSecureEnough( password )
{
    var bSecureEnough = true;

    if( password.length < 7 )    { bSecureEnough = false; }
    else 
    {
        var bHasNumber = false;
        var bHasLetter = false;

        if( password.match(/[0-9]/) )      { bHasNumber = true; }
        if( password.match(/[a-z]/i) )     { bHasLetter = true; }
        bSecureEnough = ( bHasNumber && bHasLetter );
    }
    return bSecureEnough;

} // isPasswordSecureEnough



//---------------------------------------------------------------------------------------------
// XML with Ajax data
//---------------------------------------------------------------------------------------------

//---------------------------------------------------------------------------------------------
function stripStatusFromAjaxData( data )
{
    return getXMLDoc( data ).getElementsByTagName('status')[0].childNodes[0].nodeValue ;

} // stripStatusFromAjaxData

//---------------------------------------------------------------------------------------------
function stripMessageFromAjaxData( data )
{
    return getXMLDoc( data ).getElementsByTagName('message')[0].childNodes[0].nodeValue;

} // stripMessageFromAjaxData

//---------------------------------------------------------------------------------------------
function stripDataFromAjaxData( data )
{
    return getXMLDoc( data ).getElementsByTagName('data')[0].childNodes[0].nodeValue ;

} // stripDataFromAjaxData

//---------------------------------------------------------------------------------------------
function stripIDFromAjaxData( data )
{
    return ( typeof getXMLDoc( data ).getElementsByTagName('id')[0] == 'undefined' )? "" : getXMLDoc( data ).getElementsByTagName('id')[0].childNodes[0].nodeValue;

} // stripIDFromAjaxData

//---------------------------------------------------------------------------------------------
// getXMLDoc
//
// Description: Parses and returns the XML Document for a given XML string
//              Extracted some of the code from http://www.w3schools.com/xml/xml_parser.asp
//---------------------------------------------------------------------------------------------
function getXMLDoc( data )
{
    var xmlDoc;

    if (window.DOMParser)
    {
        var parser  = new DOMParser();
        xmlDoc      = parser.parseFromString(data,'text/xml');
    }
    else // Internet Explorer
    {
        xmlDoc          = new ActiveXObject('Microsoft.XMLDOM');
        xmlDoc.async    = false;
        xmlDoc.loadXML(data);
    } 
    return xmlDoc;

} // getXMLDoc

//-------------------------------------------------------------------------------------------------------
// xmlToString - taken from http://stackoverflow.com/questions/6507293/convert-xml-to-string-with-jquery
//
// Description: converts xml data to a string
//-------------------------------------------------------------------------------------------------------
function xmlToString( xmlData ) 
{ 

    var xmlString;
    //IE
    if( window.ActiveXObject )
    {
        xmlString = xmlData.xml;
    }
    else // code for Mozilla, Firefox, Opera, etc.
    {
        xmlString = (new XMLSerializer()).serializeToString(xmlData);
    }
    return xmlString;

} // xmlToString

//-------------------------------------------------------------------------------------------------------
// taken from http://davidwalsh.name/javascript-clone
//-------------------------------------------------------------------------------------------------------
function clone( src ) 
{
	function mixin(dest, source, copyFunc) 
    {
		var name, s, i, empty = {};
		for(name in source){
			// the (!(name in empty) || empty[name] !== s) condition avoids copying properties in "source"
			// inherited from Object.prototype.	 For example, if dest has a custom toString() method,
			// don't overwrite it with the toString() method that source inherited from Object.prototype
			s = source[name];
			if(!(name in dest) || (dest[name] !== s && (!(name in empty) || empty[name] !== s))){
				dest[name] = copyFunc ? copyFunc(s) : s;
			}
		}
		return dest;
	}

	if(!src || typeof src != "object" || Object.prototype.toString.call(src) === "[object Function]")
    {
		// null, undefined, any non-object, or function
		return src;	// anything
	}
	if(src.nodeType && "cloneNode" in src)
    {
		// DOM Node
		return src.cloneNode(true); // Node
	}
	if(src instanceof Date)
    {
		// Date
		return new Date(src.getTime());	// Date
	}
	if(src instanceof RegExp)
    {
		// RegExp
		return new RegExp(src);   // RegExp
	}

	var r, i, l;
	if(src instanceof Array)
    {
		// array
		r = [];
		for(i = 0, l = src.length; i < l; ++i)
        {
			if(i in src)
            {
				r.push(clone(src[i]));
			}
		}
		// we don't clone functions for performance reasons
		//		}else if(d.isFunction(src)){
		//			// function
		//			r = function(){ return src.apply(this, arguments); };
	}
    else
    {
		// generic objects
		r = src.constructor ? new src.constructor() : {};
	}
	return mixin(r, src, clone);

} // clone( src ) 

