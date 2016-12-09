Symmetric Encryption Sample
===========================

This web page with associated JavaScript allows a user to:

* Specify a 128 bit AES key, or generate a random one
* Encrypt local files with that key, and save the encrypted version
* Decrypt previously encrypted files with the same key, and save the decrypted version

This [example](https://infotechinc.github.io/symmetric-encryption-in-browser/) is provided to illustrate how to use the W3C
[Web Cryptography API](http://www.w3.org/TR/WebCryptoAPI/ "API Draft")
to perform symmetric encryption inside a web browser. It is based
on the [working draft](http://www.w3.org/TR/2014/WD-WebCryptoAPI-20140325/ "Dated Working Draft")
of the standard available when this example was created.

Using this example requires a web browser that implements a compatible version
of the Web Cryptography API. When the example was created, current versions of
the Google Chrome browser with the optional "Enable Experimental Web Platform
features" flag enabled and recent nightly builds of the Firefox browser could
run the example.

This example uses AES in CBC mode with 128 bit keys and the 16 byte random initialization
vector placed at the beginning of the encrypted file. Modifying it
to use different size keys or different AES modes would be simple for a developer.
**This is not intended to be a production tool.** Rather, it may
be helpful to developers who intend to create their own tools using
the Web Cryptography API.

Copyright (c) 2014 Info Tech, Inc.
Provided under the MIT license.
See LICENSE file for details.
