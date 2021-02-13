const date_format = {
    format: function(date_obj){
        let year = date_obj.getFullYear();
        let month = this.pt( date_obj.getMonth() + 1 );
        let day = this.pt( date_obj.getDate() );
        let hours = this.pt( date_obj.getHours() );
        let minutes = this.pt( date_obj.getMinutes() );
        let seconds = this.pt( date_obj.getSeconds() );
        
        let date_string = `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
        
        return date_string;
    },
    pt: function(num){
        return (num < 10 ? "0" : "") + num;
    }
}

//export default date_format;
module.exports = date_format;