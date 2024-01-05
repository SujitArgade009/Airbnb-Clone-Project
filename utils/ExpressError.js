class ExpressError extends Error {
    constructor(statuscode,Message){
        super();
        this.statuscode= statuscode;
        this.message= Message;
    }
}

module.exports= ExpressError;