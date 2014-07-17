// Symmetric Encryption with Web Cryptography API
//
// Copyright (c) 2014 Info Tech, Inc.
// Provided under the MIT license.
// See LICENSE file for details.



document.addEventListener("DOMContentLoaded", function() {
    "use strict";

    // Check that web crypto is even available
    if (!window.crypto || !window.crypto.subtle) {
        alert("Your current browser does not support the Web Cryptography API! This page will not work.");
        return;
    }


    // Set up listeners for each button in the UI
    document.getElementById("generate-key").addEventListener("click", generateAKey);
    document.getElementById("encrypt").addEventListener("click", encryptTheFile);
    document.getElementById("decrypt").addEventListener("click", decryptTheFile);


    // The handlers for button clicks
    function generateAKey() {
        // Create a random key and put its hex encoded version
        // into the 'aes-key' input box for future use.

        window.crypto.subtle.generateKey(
            {name: "AES-CBC", length: 128}, // Algorithm using this key
            true,                           // Allow it to be exported
            ["encrypt", "decrypt"]          // Can use for these purposes
        ).
        then(function(aesKey) {
            window.crypto.subtle.exportKey('raw', aesKey).
            then(function(aesKeyBuffer) {
                document.getElementById("aes-key").value = arrayBufferToHexString(aesKeyBuffer);
            }).
            catch(function(err) {
                alert("Key export failed: " + err.message);
            });
        }).
        catch(function(err) {
            alert("Key generation failed: " + err.message);
        });
    }

    function encryptTheFile() {
        // Encrypt the selected file with the aes key whose
        // hex encoded value is in the 'aes-key' input box,
        // then create a download link for the result.

        // The file to encrypt
        var sourceFile = document.getElementById("source-file").files[0];

        // Grab the key bytes
        var aesKeyBytes = hexStringToByteArray(document.getElementById("aes-key").value);
        var aesKey; // To be created below

        // Set up the file reader
        var reader = new FileReader();

        // Once read, encrypt, create a Blob and add link
        reader.onload = function() {
            var iv = window.crypto.getRandomValues(new Uint8Array(16));
            window.crypto.subtle.encrypt(
                {name: "AES-CBC", iv: iv},
                aesKey,
                new Uint8Array(reader.result)
            ).
            then(function(result) {
                var blob = new Blob([iv, new Uint8Array(result)], {type: "application/octet-stream"});
                var blobUrl = URL.createObjectURL(blob);

                document.getElementById("download-links").insertAdjacentHTML(
                    'beforeEnd',
                    '<li><a href="' + blobUrl + '" download="' + sourceFile.name + '.encrypted">Encryption of ' + sourceFile.name + '</a></li>'
                    );
            }).
            catch(function(err) {
                alert("Encryption failed: " + err.message);
            });
        };

        // Import the key, and trigger the file reader when it's ready
        window.crypto.subtle.importKey(
            "raw",
            aesKeyBytes,
            {name: "AES-CBC", length: 128},
            true,
            ["encrypt", "decrypt"]
        ).
        then(function(importedKey) {
            aesKey = importedKey;
            reader.readAsArrayBuffer(sourceFile);
        }).
        catch(function(err) {
            alert("Key import and file read failed: " + err.message);
        });
    }



    function decryptTheFile() {
        // Decrypt the selected file with the aes key whose
        // hex encoded value is in the 'aes-key' input box,
        // then create a download link for the result.

        // The file to decrypt
        var sourceFile = document.getElementById("source-file").files[0];

        // Grab the key bytes
        var aesKeyBytes = hexStringToByteArray(document.getElementById("aes-key").value);
        var aesKey; // To be created below

        // Set up the file reader
        var reader = new FileReader();

        // Once read, decrypt, create a Blob and add link
        reader.onload = function() {
            var iv = new Uint8Array(reader.result.slice(0, 16));
            window.crypto.subtle.decrypt(
                {name: "AES-CBC", iv: iv},
                aesKey,
                new Uint8Array(reader.result.slice(16))
            ).
            then(function(result) {
                var blob = new Blob([new Uint8Array(result)], {type: "application/octet-stream"});
                var blobUrl = URL.createObjectURL(blob);

                document.getElementById("download-links").insertAdjacentHTML(
                    'beforeEnd',
                    '<li><a href="' + blobUrl + '" download="' + sourceFile.name + '.decrypted">Decryption of ' + sourceFile.name + '</a></li>'
                    );
            }).
            catch(function(err) {
                alert("Decryption failed: " + err.message);
            });
        };

        // Import the key, and trigger the file reader when it's ready
        window.crypto.subtle.importKey(
            "raw",
            aesKeyBytes,
            {name: "AES-CBC", length: 128},
            true,
            ["encrypt", "decrypt"]
        ).
        then(function(importedKey) {
            aesKey = importedKey;
            reader.readAsArrayBuffer(sourceFile);
        }).
        catch(function(err) {
            alert("Key import and file read failed: " + err.message);
        });
    }



    // Utility functions
    function arrayBufferToHexString(arrayBuffer) {
        var byteArray = new Uint8Array(arrayBuffer);
        var hexString = "";
        var nextHexByte;

        for (var i=0; i<byteArray.byteLength; i++) {
            nextHexByte = byteArray[i].toString(16);  // Integer to base 16
            if (nextHexByte.length < 2) {
                nextHexByte = "0" + nextHexByte;     // Otherwise 10 becomes just a instead of 0a
            }
            hexString += nextHexByte;
        }
        return hexString;
    }

    function hexStringToByteArray(hexString) {
        if (hexString.length % 2 !== 0) {
            throw Error("Must have an even number of hex digits to convert to bytes");
        }

        var numBytes = hexString.length / 2;
        var byteArray = new Uint8Array(numBytes);
        for (var i=0; i<numBytes; i++) {
            byteArray[i] = parseInt(hexString.substr(i*2, 2), 16);
        }
        return byteArray;
    }

});
