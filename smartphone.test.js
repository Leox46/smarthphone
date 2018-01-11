const root = 'https://smartphoneapp.herokuapp.com/api/v1' // 'http://127.0.0.1:8080/api/v1' process.env.SERVER_URL
const fetch = require("node-fetch")
const smartphonesRoot = root+'/smartphones'
const exampleSmartphone =  {
    "brand": "prova marca",
    "model": "prova modello",
    "price": 400.99
}

// importante per il TEST COVERAGE!
// const server = require('./server');

// helper methods - you can put these  in a separate file if you have many tests file and want to reuse them

const postSmartphones = function (newSmartphone) {
    return fetch(smartphonesRoot, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(newSmartphone)
    })
}

const putSmartphones = function (_id, smartphone) {
    return fetch(smartphonesRoot+'/'+_id, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(smartphone)
    })
}

const deleteSmartphones = function (_id) {
    return fetch(smartphonesRoot+'/'+_id, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    })
}


const getManySmartphones = function () {
    return fetch(smartphonesRoot, {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    })
}

const getOneSmartphone = function (_id) {
    return fetch(smartphonesRoot+'/'+_id, {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    })
}



test('basic post and get single element', () => {
  return postSmartphones(exampleSmartphone)
    .then(postResponse => { return postResponse.json() })
    .then(postResponseJson => {
      exampleSmartphone._id = postResponseJson._id
      return getOneSmartphone(exampleSmartphone._id)
    })
    .then(getResponse => {return getResponse.json()})
    .then(jsonResponse => {expect(jsonResponse).toMatchObject(exampleSmartphone)})
    //.catch(e => {console.log(e)})
});

// importante! Mettere la PUT prima della DELETE!
test('put item by _id - basic response', () => {
  return putSmartphones(exampleSmartphone._id, exampleSmartphone)
    .then(response => { expect(response.status).toBe(200) })
    //.catch(e => {console.log(e)})
});

test('delete by _id - basic response', () => {
  return deleteSmartphones(exampleSmartphone._id)
    .then(response => { expect(response.status).toBe(200) })
    //.catch(e => {console.log(e)})
});

test('get all smartphones - basic response', () => {
  return getManySmartphones()
    .then(response => { expect(response.status).toBe(200) })
    //.catch(e => {console.log(e)})
});


/*
test('delete by smartphoneID - item actually deleted', () => {
  return getOneSmartphone(exampleSmartphone._id)
    .then(res => {expect(res.status).toBe(404)})
    //.catch(e => {console.log(e)})
});
*/
