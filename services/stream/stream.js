/**
 * @TODO reading the file as stream
 * */
const readfile = async(req, res) => {
    const raw = fs.readFileSync(path.resolve(filePath));
    res.end(raw, "binary").status(200);
};