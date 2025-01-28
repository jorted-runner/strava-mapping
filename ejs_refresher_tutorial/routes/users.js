const express = require('express')
const router = express.Router()

// Always put static routes above dynamic routes. They are read and process in descending order

router.get('/', (req, res) => {
    const name = req.query.name
    console.log(name)
	res.send('User List');
});

router.get('/new', (req, res) => {
	res.render('users/new')
});

router.post('/', (req, res) => {
    const isValid = true
    if (isValid) {
        users.push( { firstName: req.body.firstName})
        res.redirect(`/users/${users.length - 1 }`)
    } else {
        console.log("error saving new user")
        res.render('users/new', {firstName: req.body.firstName})
    }
})


router.route('/:id')
    .get((req, res) => {
        // console.log(req.user.name)
        const id = req.params.id
        res.send(`User get with ID ${id}`)
    })
    .put((req, res) => {
        const id = req.params.id;
        res.send(`Update User with ID ${id}`);
    })
    .delete((req, res) => {
        const id = req.params.id;
        res.send(`Delete User with ID ${id}`);    
    })

const users = [{ name: "Kyle" }, { name: "Danny" }]

router.param("id", (req, res, next, id) => {
    req.user = users[id]
    next()
})


// router.get('/:id', (req, res) => {
//     const id = req.params.id
//     res.send(`User get with ID ${id}`)
// })

// router.put('/:id', (req, res) => {
// 	const id = req.params.id;
// 	res.send(`Update User with ID ${id}`);
// });

// router.delete('/:id', (req, res) => {
// 	const id = req.params.id;
// 	res.send(`Delete User with ID ${id}`);
// });

module.exports = router
