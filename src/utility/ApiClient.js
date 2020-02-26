const apiRoot = process.env.NODE_ENV === 'development' ?
    'http://localhost:3001' :
    'https://ancient-plains-38653.herokuapp.com/'

export default {
    apiRoot: apiRoot
}