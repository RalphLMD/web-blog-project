const express = require("express")
const bodyParser = require("body-parser")
const ejs = require("ejs")
const _ = require("lodash")
const mongoose = require("mongoose")

const app = express()

app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static("public"))

mongoose.connect("mongodb://localhost:27017/blogDB")

const blogSchema = mongoose.Schema(
    {
        title: String,
        content: String,
    }
)

const blogArticle = mongoose.model("blogArticle", blogSchema)

const homeContent = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
const aboutContent = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
const contactContent = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."

//let articles = []

app.listen(3000, function(){
    console.log("Server is running")
})

app.get("/", function(request, response){
    blogArticle.find({})
    .then(function(findArticles){

        response.render("home", {
            contentHome: homeContent, 
            //articles: articles,
            newArticle: findArticles
            //contentCompose: articles
        })

        console.log("Data has been found!")
    }).catch(function(err){
        console.log(err)
    })


})

// <% for (var i = 0; i<contentCompose.length; i++){ %>
//     <div class="d-inline-flex">
//         <div class="published-container mt-5">
//             <div class="row">
//                 <div class="col">
//                     <p><%=contentCompose[i].title%></p>
//                     <p><%=contentCompose[i].content%></p>
//                 </div>
//             </div>
//         </div>
//     </div>
// <% } %>

app.get("/about", function(request, response){
    response.render("about", {contentAbout: aboutContent})
})

app.get("/contact", function(request, response){
    response.render("contact", {contentContact: contactContent})
})

app.get("/compose", function(request, response){
    response.render("compose")
})

app.post("/compose", function(request, response){
    const title = request.body.articleTitle
    const content = request.body.articleContent

    const article = new blogArticle({
        // title: request.body.inputCompose, 
        // content: request.body.inputComposeTwo
        title: title,
        content: content
    })

    // articles.push(article)
    article.save()
    response.redirect("/")
})

app.get("/articles/:articleId", function(request, response){
    const requestedArticle = request.params.articleId
  
    // articles.forEach(function(article){
    //     var storedArticle = _.lowerCase(article.title)

    //     if(storedArticle === requestedArticle){
    //         response.render("article", {
    //             title: article.title, 
    //             content: article.content 
    //         })
    //     } 
    // })

    // blogArticle.findOne({title: requestedArticle})
    // .then(function(findArticle){
    //     response.render('list', {
    //         article: findArticle,
    //     })
    // .catch(function(err){
    //         console.log(err)
    //     })
    // })

    blogArticle.findOne({_id: requestedArticle})
    .then(function(findArticle){

        response.render("article", {
            articleId: requestedArticle,
            articleTitle: findArticle.title,
            articleContent: findArticle.content
        })

        console.log("Data has been found!")
    }).catch(function(err){
        console.log(err)
    })

})

app.post("/delete", function(request, response){
    const articleId = request.body.articleId

    blogArticle.findByIdAndDelete(articleId)
    .then(function(){
        console.log("Deleted")
    })
    .catch(function(err){
        console.log(err)
    })

    response.redirect("/")
})
