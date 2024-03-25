sap.ui.define([
], function () {
    'use strict';

    return {
        getName: function (value,propertyName) {

            var skipProperties = ["REF_TYPE"]; // Add other property names to skip as needed

    // Check if the property name is in the skipProperties array
    if (skipProperties.includes(propertyName)) {
        // Return the value unchanged
        return value;
    }

            if (typeof value === 'string' && value.length > 0) {
            let words = value.split(' ');


            let capitalizedWords = words.map(word => {
                // Capitalize the first letter of the word and concatenate it with the rest of the word
                return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
            });
        
            // Join the capitalized words back into a single string
            return capitalizedWords.join(' ').trim();

            

        }else if (Array.isArray(value)) {
            // If it's an array, apply the formatter recursively to each element
            return value.map(function (element) {
                return this.getName(element);
            }, this);
        } else{
            return value;
        }
            
        },

        
    };
});
