const fs = require('fs');
const { stringify } = require('nodemon/lib/utils');
const path = require('path');

const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
const writeJson = dataBase => fs.writeFileSync(productsFilePath, JSON.stringify(dataBase), 'utf-8')

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const controller = {
	// Root - Show all products
	index: (req, res) => {
		res.render('products', {
			products,
			toThousand
		})
	},

	// Detail - Detail from one product
	detail: (req, res) => {
		let productId = +req.params.id;
		let product = products.find(product => product.id === productId)

		res.render('detail', {
			product,
			toThousand
		})
	},

	// Create - Form to create
	create: (req, res) => {
		res.render('product-create-form')
	},
	
	// Create -  Method to store
	store: (req, res) => {
		res.send =  req.file
		let lastId = 1;

		products.forEach(product => {
			if(product.id > lastId){
				lastId = product.id
			}
		})
		/* let newProduct = {
			id : lastId + 1,
			name,
			price: +price,
			discount :+discount,
			category,
			description,
			image: "default-image.png"
		} */

			let newProduct = {
				...req.body,
				id: lastId + 1,
				image: req.file ? req.file.filename : "default-image.png"
			}

			products.push(newProduct)

			writeJson(products)

			res.redirect('/products')

	},

	// Update - Form to edit
	edit: (req, res) => {
		let productId = +req.params.id;
		let productToEdit = products.find(product => product.id === productId)

		res.render('product-edit-form', {
			product: productToEdit
		})
	},
	// Update - Method to update
	update: (req, res) => {
		let productId = +req.params.id;

		const {name, price, discount, category, description} =  req.body

		products.forEach(product => {
			if(product.id === productId){
				product.id = product.id,
				product.name = name,
				product.price = +price,
				product.discount = discount,
				product.description = description
				if(req.file){
					if(fs.existsSync("./public/images/products/", product.image)){
						fs.unlinkSync(`./public/images/products/${product.image}`)
					}else{
						console.log('No encontre el archivo')
					}
					product.image = req.file.filename
				}else{
					product.image = product.image
				}
			}
		})

		writeJson(products)

		res.redirect(`/products/detail/${productId}`)

	},

	// Delete - Delete one product from DB
	destroy : (req, res) => {
		let productId = +req.params.id;

		products.forEach(product => {
			if(product.id === productId){
				if(fs.existsSync("./public/images/products/", product.image)){
					fs.unlinkSync(`./public/images/products/${product.image}`)
				}else{
					console.log('No encontre el archivo')
				}

				let productToDestroyIndex = products.indexOf(product)
				if(productToDestroyIndex !== -1 ){
					products.splice(productToDestroyIndex, 1) 
				}else{
					console.log('No encontre el producto')
			}
			}
		})
		writeJson(products)
		res.send(`Has eliminado el producto${productId}`)
	}
};

module.exports = controller;