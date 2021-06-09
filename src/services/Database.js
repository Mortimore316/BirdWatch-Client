import Api from '@/services/Api.js'
/* eslint-disable */ 

export default{
    DataBaseCall (QueryInfo){
        return Api().post('DataBaseCall', QueryInfo)
    }    
}
//    Example SubmitBirdQuery call:
//AuthenticationService.SubmitBirdQuery({
//    latitude: '30.395166',
//    longitude: '-97.339433',
//    date: '01-18-2021
//})