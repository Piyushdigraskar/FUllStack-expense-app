function saveToLocal(event) {
    event.preventDefault();
    let expenseDetails = {
        name: event.target.name.value,
        selling: event.target.selling.value,
        Category: event.target.Category.value
    };
    const token = localStorage.getItem('token');
    axios.post("http://3.26.185.160:3000/expense/add-user", expenseDetails, { headers: { "Authorization": token } })
        .then((respone) => {

            //addNewExpensetoUI(respone.data.expense);
            getExpenses(1);

        })
        .catch((err) => {
            document.body.innerHTML = document.body.innerHTML + "<h3>Something went wrong</h3>";
            console.log(err);
        })

}

function showPremiumuserMessage() {
    document.getElementById('rzp-button1').style.visibility = "hidden";
    document.getElementById('message').innerHTML = "You are a premium user now";
}

function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

window.addEventListener("DOMContentLoaded", () => {
    // const objUrlParams = new URLSearchParams(window.location.search);
    // const page = objUrlParams.get("page") || 1;
    const page = 1;
    const token = localStorage.getItem('token');
    const decodeToken = parseJwt(token);
    console.log(decodeToken);
    const ispremiumuser = decodeToken.ispremiumuser;
    if (ispremiumuser) {
        showPremiumuserMessage();
        showLeaderboard();
    }
    axios.get(`http://3.26.185.160:3000/expense/get-user?page=${page}`, { headers: { "Authorization": token } })
        .then((respone) => {
            const { ...pageData } = respone.data
            
                addNewExpensetoUI(respone.data.expenses)
                showPagination(pageData);

        }).catch((err) => {

            console.log(err);
        })


})
const pagination = document.getElementById('pagination');
function showPagination({
    currentPage,
    hasNextPage,
    nextPage,
    hasPreviousPage,
    previousPage,
    lastPage
}) {

    pagination.innerHTML = '';
    console.log(currentPage,
        hasNextPage,
        nextPage,
        hasPreviousPage,
        previousPage,
        lastPage)
    if (hasPreviousPage) {
        const btn2 = document.createElement('button');
        btn2.innerHTML = previousPage;
        btn2.addEventListener('click', () => getExpenses(previousPage));
        pagination.appendChild(btn2);
    }
    const btn1 = document.createElement('button');
    btn1.innerHTML = currentPage;
    btn1.addEventListener('click', () => getExpenses(currentPage));
    pagination.appendChild(btn1);

    if (hasNextPage) {
        const btn3 = document.createElement('button');
        btn3.innerHTML = nextPage;
        btn3.addEventListener('click', () => getExpenses(nextPage));
        pagination.appendChild(btn3);
    }
}

function getExpenses(page =1) {
    const token = localStorage.getItem('token');

    axios.get(`http://3.26.185.160:3000/expense/get-user?page=${page}`, { headers: { "Authorization": token } })
        .then((respone) => {
            const { ...pageData } = respone.data
            addNewExpensetoUI(respone.data.expenses)
            showPagination(pageData);
            console.log(respone.data.expenses);

        }).catch((err) => {

            console.log(err);
        })

}


function showLeaderboard() {
    const inputElement = document.createElement("input");
    inputElement.type = "button";
    inputElement.value = 'Show Leaderboard';
    inputElement.onclick = async () => {
        const token = localStorage.getItem('token');
        const userLeaderBoardArray = await axios.get("http://3.26.185.160:3000/premium/showLeaderBoard", { headers: { "Authorization": token } });
        console.log(userLeaderBoardArray)


        var LeaderboardElem = document.getElementById('leaderboard');
        LeaderboardElem.innerHTML += `<h1>Leader Board</h1>`
        userLeaderBoardArray.data.forEach((userDetails) => {
            LeaderboardElem.innerHTML += `<li>name - ${userDetails.name} total Expense - ${userDetails.totalExpenses}</li>`
        })
    }
    document.getElementById("message").appendChild(inputElement);
}

function deleteExpense(event, expenseid) {
    const token = localStorage.getItem('token');
    axios.delete(`http://3.26.185.160:3000/expense/delete-user/${expenseid}`, { headers: { "Authorization": token } }).then(() => {
        removeExpenseFromUI(expenseid);
    }).catch((err) => {

        console.log(err);
    })
}
const parentElem = document.getElementById('listOfExpenses');
function addNewExpensetoUI(expenses) {
    parentElem.innerHTML = '';
    
    for (let i = 0; i < expenses.length; i++) {
        const expenseElemId = `expense-${expenses[i].id}`;
        parentElem.innerHTML += `
        <li id=${expenseElemId}>
            ${expenses[i].selling}-${expenses[i].name}-${expenses[i].Category}
            <button onclick='deleteExpense(event, ${expenses[i].id})'>
                Delete Expense
            </button>
        </li>`
    }


}

function removeExpenseFromUI(expenseid) {
    const expenseElemId = `expense-${expenseid}`;
    document.getElementById(expenseElemId).remove();
}

function download() {
    const token = localStorage.getItem('token');
    axios.get('http://3.26.185.160:3000/user/download', { headers: { "Authorization": token } })
        .then((response) => {
            if (response.status === 200) {
                //the bcakend is essentially sending a download link
                //  which if we open in browser, the file would download
                var a = document.createElement("a");
                a.href = response.data.fileURL;
                a.download = 'myexpense.csv';
                a.click();
            } else {
                throw new Error(response.data.message)
            }

        })
        .catch((err) => {
            console.log(err);
        });
}


document.getElementById('rzp-button1').onclick = async function (event) {
    const token = localStorage.getItem('token');
    const response = await axios.get(`http://3.26.185.160:3000/purchase/premiummembership`, { headers: { "Authorization": token } });
    console.log(response.data.order.id);

    var options =
    {
        "key": response.data.key_id,
        "order_id": response.data.order.id,
        "handler": async function (response) {
            const res = await axios.post(`http://3.26.185.160:3000/purchase/updatetransactionstatus`, {
                order_id: options.order_id,
                payment_id: response.razorpay_payment_id,
            }, { headers: { "Authorization": token } })

            console.log(res)
            alert('You are a premium user now')
            document.getElementById('rzp-button1').style.visibility = "hidden";
            document.getElementById('message').innerHTML = "You are a premium user now";
            localStorage.setItem('token', res.data.token);
            showLeaderboard();
        },
    };
    const rzp1 = new Razorpay(options);
    rzp1.open();
    event.preventDefault();


    rzp1.on('payment.failed', function (response) {
        console.log(response);
        alert('Something went wrong');
    });
}