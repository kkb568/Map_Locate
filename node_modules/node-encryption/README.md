# node-encryption
This package will simplify the process of encrypting and decrypting data for your application based on the aes-256-gcm algorithm.

```bash
$ npm install --save node-encryption
```

### How to use this package
```javascript
const { encrypt, decrypt } = require('node-encryption');


const text = 'This will be encrypted';
const encryptionKey = 'mysecretkey1337';

const encrypted = encrypt(text, encryptionKey);

const decrypted = decrypt(encrypted, encryptionKey);

console.log(decrypted.toString());
// Output: This will be encrypted


// By using a buffer
const encryptBuffer = encrypt(Buffer.from(text), encryptionKey);

const decyptBuffer = decrypt(encryptBuffer, encryptionKey);

console.log(decrypted.toString());
// Output: This will be encrypted
```

### How to encrypt a file
```javascript
const image = fs.readFileSync('./shyguy.png');

const encryptionKey = 'mysecretkey1337';

const encrypted = encrypt(image, encryptionKey);

const decrytedImageBuffer = decrypt(encrypted, encryptionKey);
```

### License
MIT - see LICENSE