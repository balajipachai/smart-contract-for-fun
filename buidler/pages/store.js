const style = {
    "margin-left": "40%",
    "margin-top": "20%"
};

import Link from 'next/link';

export default function Store() {
    return (
        <div id="main" style={style}>
            <form>
                <p>Owner Ethereum Public Key</p>
                <input type="text" id="ownerAddr" name="ownerAddr" /><br></br>
                <p>Please add timestamp</p>
                <input type="text" id="timestamp" name="timestamp" /><br></br>
                <p>Select File to Copyright</p>
                <input type="file" id="file" name="file" /><br></br>
            </form>
            <h2>
                <Link href="/">
                    <a>Back to home</a>
                </Link>
            </h2>
        </div>
    );
}