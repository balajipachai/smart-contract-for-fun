const style = {
    "margin-left": "40%",
    "margin-top": "20%"
};

export default function Store() {
    return(
        <div id="main" style={style}>
        <form>
            <p>Owner Ethereum Public Key</p>
            <input type="text" id="ownerAddr" name="ownerAddr"/><br></br>
            <p>Please add timestamp</p>
            <input type="text" id="timestamp" name="timestamp"/><br></br>
            <p>Select File to Copyright</p>
            <input type="file" id="file" name="file"/><br></br>
        </form>
        </div>
    );
}