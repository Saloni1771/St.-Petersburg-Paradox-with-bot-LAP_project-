export default {
    generateRandomString() {
        const crypto = window.crypto || window.msCrypto;
        let array = new Uint32Array(1);
        
        return crypto.getRandomValues(array);
    },

    getQString( url = '', keyToReturn = '' ) {
        url = url ? url : location.href;
        let queryStrings = decodeURIComponent( url ).split( '#', 2 )[0].split( '?', 2 )[1];

        if ( queryStrings ) {
            let splittedQStrings = queryStrings.split( '&' );

            if ( splittedQStrings.length ) {
                let queryStringObj = {};

                splittedQStrings.forEach( function ( keyValuePair ) {
                    let keyValue = keyValuePair.split( '=', 2 );

                    if ( keyValue.length ) {
                        queryStringObj[keyValue[0]] = keyValue[1];
                    }
                } );

                return keyToReturn ? ( queryStringObj[keyToReturn] ? queryStringObj[keyToReturn] : null ) : queryStringObj;
            }

            return null;
        }

        return null;
    },

    users(userList, amount){
        document.querySelector('.users').innerHTML = "<tr><td>Name</td><td>Amount</td><td>Score</td><td>Take Away</td></tr>";
        for (var key in userList) {
            var takeAway = userList[key].score-userList[key].amount;
            document.querySelector('.users').innerHTML += "<tr><td>"+key.split(',')[1]+"</td><td>"+userList[key].amount+"</td><td class = "+key.split(',')[1]+">"+userList[key].score+"</td><td>"+takeAway+"</td></tr>";
        }
    },
    
};
