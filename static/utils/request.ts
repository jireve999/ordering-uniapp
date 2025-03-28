function request(url:string,method:string="",data:Object={}){
  return new Promise(((resolve:any, reject:any) => {
      uni.request({
          url: url,
          data: data,
          method:method.toLocaleUpperCase(),
          header: {
              'content-type': 'application/x-www-form-urlencoded'
          },
          success: (res:any) => {
              resolve(res.data)
          },
          fail:(res:any)=>{
              reject(res)
          }
      });
  }))
}
export {
  request
}
