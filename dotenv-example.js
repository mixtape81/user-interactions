console.log('No value for FOO yet:', process.env.FOO);

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load();
}

console.log('Now the value for FOO is:', process.env.FOO);
