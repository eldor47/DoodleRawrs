

const headers = { headers: { 'x-api-key': process.env.REACT_APP_API_KEY } }

const getAuth = async (publicAddress, signData)=> {
    var res;
    var options = {
        address: publicAddress,
        signature: signData
    }
    try {
        res = await axios.post('https://xefu37ittb.execute-api.us-west-1.amazonaws.com/test/auth', options, headers);
    } catch (e) {
        console.log(e)
        return false;
    }

    if(res.data.statusCode === 200){
        return true
    } else {
        return false
    }
}

const getUser = async (publicAddress)=> {
    var res;
    var options = {
        address: publicAddress
    }
    try {
        res = await axios.post('https://xefu37ittb.execute-api.us-west-1.amazonaws.com/test/users', options, headers);
    } catch (e) {
        console.log(e)
        return -1;
    }

    console.log(res.data)
    return res.data.nonce
}
