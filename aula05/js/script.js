// Fazer referências aos controles html do formulário
const btn = document.getElementById("btnLogin");
const txtuser = document.getElementById("txtuser");
const txtsenha = document.getElementById("txtpassword");
let autenticado;
let token;
let key;

btn.onclick = ()=>{
    // Validação dos campos usuario e senha
    if(txtuser.value.trim()=="" || txtsenha.value.trim()==""){
        return alert("Nome de usuário e senha obrigatório");
    }
    else{
        /*
        Vamos usar o comando fetch(buscar para fazer uma requisição
            a nossa API e, realizar o login. Passaremos o nome de
            usuário e senha.
        */
       fetch("http://127.0.0.1:30021/users/login",{
            method:"POST",
            headers:{
                "accept":"application/json",
                "content-type":"application/json"
            },
            body:JSON.stringify({
                nomeusuario:txtuser.value,
                senha:txtsenha.value
            })
       }).then((response)=>response.json()).then((dado)=>{
        if(dado.output=="Authenticated"){
            autenticado = true;
            token = dado.token;
            txtuser.value = "";
            txtsenha.value = "";
            // Mudar de tela
            window.location.href=`list.html?key=${token}`;
            //window.location.replace("list.html");
        }
        else{
            txtuser.value = "";
            txtsenha.value = "";
            return alert("Usuário ou Senha incorretos");
        }
       }).catch((error)=>console.error(`Não foi possível requisitar a API -> ${error}`))
    }
}

document.getElementById("registro").onclick = ()=> {
    document.getElementById("shadow").style.zIndex="100";
    document.getElementById("shadow").style.opacity="1";
}

document.getElementById("fechar").onclick = ()=> {
    document.getElementById("shadow").style.zIndex="-100";
    document.getElementById("shadow").style.opacity="0";
}

//Script para cadastrar um novo usuário no banco de dados
const btncad = document.getElementById("btncadastrar");
const txtusuario = document.getElementById("txtusuario");
const txtpasswd = document.getElementById("txtpasswd");
const txtemail = document.getElementById("txtemail");
const txtfoto = document.getElementById("txtfoto");

btncad.onclick = ()=> {
    if(txtusuario.value.trim()=="" || txtpasswd.value.trim()=="" || txtemail.value.trim()==""){
        return alert("Todos os campos devem ser preenchidos")
    }
    else{
        fetch("http://127.0.0.1:30021/users/insert",{
            method:"POST",
            headers:{
                "accept":"application/json",
                "content-type":"application/json"
            },
            body:JSON.stringify({
                nomeusuario:txtusuario.value,
                senha:txtpasswd.value,
                email:txtemail.value,
                foto:txtfoto.value
            })
        }).then((response)=>response.json()).then((result)=>{
            if(result.output=="Inserted"){
                alert("Usuário cadastrado com sucesso!");
                txtusuario.value = "";
                txtsenha.value = "";
                txtemail.value = "";
                txtfoto.value = "";
                document.getElementById("shadow").style.zIndex="-100";
                document.getElementById("shadow").style.opacity="0";
            }
            else{
                alert("Não foi possivel cadastrar. Tente outra vez")
            }
        })
        .catch((error)=>console.error(`Erro ao cadastrar->${error}`))
    }
}

function carregarDados(){

key = window.location.search.substring(5,window.location.search.length);

const estrutura = document.getElementById("estrutura");
fetch("http://127.0.0.1:30021/users/list", {
    method:"GET",
    headers:{
        "accept":"application/json",
        "content-type":"application/json",
        "token":key
    }
})
.then((response)=>response.json())
.then((result)=>{
    result.data.map((item,index)=>{
        let div_user = document.createElement("div");
        div_user.setAttribute("class","div_user");
        div_user.innerHTML=`
                <img src="img/avatar.png">
                <h2>${item.nomeusuario}</h2>
                <h3>${item.email}</h3>
                <a href="#" onclick="editar('${item.idusuario}','${item.nomeusuario}','${item.email}','${item.foto}')">
                    <img src="img/editar.png">
                </a>
            `;
        estrutura.appendChild(div_user);
    })
}).catch((error)=>console.log(`Erro ao executar a API -> ${error}`))
}

function editar(id, usuario,email,foto){

    // Fazer uma referência ao body da página html
    const body = document.body;
    const div_shadow = document.createElement("div");
    const div_white = document.createElement("div");
    const form = document.createElement("form");
    const input_id = document.createElement("input");
    const input_user = document.createElement("input");
    const input_passwd = document.createElement("input");
    const input_confirm = document.createElement("input");
    const input_email = document.createElement("input");
    const input_file = document.createElement("input");
    const input_sub = document.createElement("input");
    const fechar = document.createElement("a")

    // Aplicar atributos aos elementos
    div_shadow.setAttribute("id","div_shadow");

    div_white.setAttribute("id","div_white");
    fechar.setAttribute("href", "#")
    fechar.setAttribute("id", "fechar")
    fechar.setAttribute("onclick", "fecharFormAtualizar();")
    fechar.innerHTML="&times;"
    div_white.appendChild(fechar)


    // Atributo para não enviar o formulário. O envio será feito via Javascript
    form.setAttribute("onsubmit","return false");

    // Aplicar os atribultos ao id: type, placeholder, disabled
    input_id.setAttribute("type","text");
    input_id.setAttribute("placeholder",`Id Usuário ${id}`);
    input_id.setAttribute("disabled","true");

    //Aplicar os atribultos ao user: type, placeholder, disabled
    input_user.setAttribute("type","text");
    input_user.setAttribute("placeholder",`Usuário ${usuario}`);
    input_user.setAttribute("disabled","true");

    // Aplicar os atributos a senha e a confirmação
    input_passwd.setAttribute("type","password");
    input_passwd.setAttribute("placeholder",`Senha`);

    input_confirm.setAttribute("type","password");
    input_confirm.setAttribute("placeholder",`Confirme a Senha`);

    //aplicar os atributos ao email: type, placeholder
    input_email.setAttribute("type","email");
    input_email.setAttribute("placeholder",`${email}`);

    // Aplicar os atributos ao controle file: type, value
    input_file.setAttribute("type","file");
    input_file.setAttribute("placeholder",`${foto}`);

    // Aplicar atributos ao controle submit: type, value
    input_sub.setAttribute("type","submit");
    input_sub.setAttribute("placeholder",`Atualizar`);

    input_sub.onclick = ()=>{
        if(input_confirm != input_passwd){
            return alert("As senhas não coencidem");
        }
        else{
            fetch(`http://127.0.0.1:30021/users/update/${id}`,{
                method:"PUT",
                headers:{
                    "accept":"application/json",
                    "content-type":"application/json",
                    "token":key
                },
                body:JSON.stringify({
                    senha:input_passwd.value,
                    email:input_email.value,
                    foto:input_file.value
                })

            }).then((response)=>response.json())
            .then((dados)=>{
                alert(dados.output);
            }).catch((error)=>console.error(`Erro ao ler a api ->${error}`))
        }
    }

    form.appendChild(input_id);
    form.appendChild(input_user);
    form.appendChild(input_passwd);
    form.appendChild(input_confirm);
    form.appendChild(input_email);
    form.appendChild(input_file);
    form.appendChild(input_sub);


    div_white.appendChild(form);
    div_shadow.appendChild(div_white);
    body.appendChild(div_shadow);
}

function fecharFormAtualizar(){
    document.getElementById("div_shadow").style.zIndex="-100"
    document.getElementById("div_shadow").style.opacity="0"
    window.location.reload()
}