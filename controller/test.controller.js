

export const shouldBeLoggedIn = async (req, res) => {

    console.log(req.userId);
    res.status(200).json({ message: "You are Authorized!" })

}
export const shouldBeAdmin = async (req, res) => {


    res.status(200).json({ message: "You are Authorized!" })
}