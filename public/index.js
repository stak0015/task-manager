document.addEventListener("DOMContentLoaded", event => {
    const app = firebase.app()
    const db = firebase.firestore()
    // db.collection('tasks').add({
    //     name: 'Task',
    //     type: 'Bug',
    //     description: 'This is a description',
    //     priority: 'High',
    //     points: 5,
    //     tags: ['tag1','tag2']
    // })
    displayTasks()
    // db.collection('tasks').get().then(function(querySnapshot) {
    //     querySnapshot.forEach(function(doc) {
    //         // doc.data() is never undefined for query doc snapshots
    //         const viewButton = document.createElement('button')
    //         viewButton.textContent = 'View Task'
    //         document.querySelector('#buttons').appendChild(viewButton)

    //         const delButton = document.createElement('button')
    //         delButton.textContent = 'Delete Task'
    //         document.querySelector('#buttons').appendChild(delButton)

    //         console.log(doc.id, " => ", doc.data())
    //         viewButton.addEventListener('click', event => {
    //             viewTask(doc.id)
    //         })
    //         delButton.addEventListener('click', event => {
    //             deleteTask(doc.id)
    //         })
    //     });
        
    // });
    




    // const myPost = db.collection('posts').doc('firstpost');
    // myPost.onSnapshot(doc => {
    //     const data = doc.data();
    //     document.querySelector('#title').innerHTML = data.title;
    // })
})



function displayTasks(){
    // Check if tasks array contains data
    const taskContainer = document.querySelector('.task-container');

    const db = firebase.firestore()

    // Loop through the tasks array and create task elements
    db.collection('tasks').get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            data = doc.data()
            const newTaskElement = document.createElement('div');
            newTaskElement.classList.add('task')
            // newTaskElement.classList.add(getPriorityClass(newTask.priority));
        
            // const taskDetails = document.createElement('div');
            // taskDetails.classList.add('task-details');
        
            const taskPriority = document.createElement('div');
            taskPriority.classList.add(getPriorityClass(data.priority));

            const taskStoryPoints = document.createElement('div');
            taskStoryPoints.classList.add('task-story-points');
            taskStoryPoints.textContent = data.points;

            // const taskStoryPoints = document.createElement('p');
            // taskStoryPoints.textContent = newTask.points;
            // taskStoryPointsContainer.appendChild(taskStoryPoints);
        
            taskPriority.appendChild(taskStoryPoints);
            
            const taskName = document.createElement('div');
            taskName.classList.add('task-name');
            taskName.textContent = data.name;
        
            taskPriority.appendChild(taskName);

            // const taskName = document.createElement("p");
            // taskName.textContent = newTask.name;
            // taskPriority.appendChild(taskName);
        
            // const storyPoint = document.createElement('span');
            // storyPoint.classList.add('story-point');
            // storyPoint.textContent = newTask.points;

            const tagsContainer = document.createElement('div');
            if (data.tags[0] != ""){
                tagsContainer.classList.add('tags-container');
                // Check if task has tags and display them
                if (data.tags && data.tags.length > 0) {
                    data.tags.forEach((tag) => {
                        const tagElement = document.createElement('div');
                        tagElement.classList.add('tag');
                        tagElement.textContent = tag;
                        tagsContainer.appendChild(tagElement);
                    });
                    // const breakElement = document.createElement('br');
                    // tagsContainer.appendChild(breakElement);
                }
            }
        
            // taskDetails.appendChild(storyPoint);
            newTaskElement.appendChild(taskPriority);
            // newTaskElement.appendChild()
            newTaskElement.appendChild(tagsContainer);

            const taskDescription = document.createElement('div');
            taskDescription.classList.add('task-description');
            taskDescription.textContent = data.description;

            newTaskElement.appendChild(taskDescription);
        
            newTaskElement.addEventListener('click', () => {
                const pageMask = document.getElementById('pageMask')
                pageMask.style.visibility = 'visible';
                displayTaskDetails(doc.id);
            })
        
            taskContainer.appendChild(newTaskElement);

            console.log(doc.id, " => ", doc.data())
            
        });
        
    });

}


function displayTaskDetails(id) {
    // Create a modal element with a unique ID
    const db = firebase.firestore()
    const task = db.collection('tasks').doc(id)
    const modal = document.createElement('div');
    const pageMask = document.getElementById('pageMask')

    task.onSnapshot(doc => {
        const data = doc.data();
        modal.classList.add('modal');
    
        // Create the modal content
        const modalContent = document.createElement('div');
        modalContent.classList.add('modal-content');

        const priorityCover = document.createElement('div');
        priorityCover.classList.add(getPriorityClass2(data.priority));
        const storyPoints = document.createElement('div');
        storyPoints.classList.add('view-task-story-points')
        storyPoints.textContent = data.points;
        priorityCover.appendChild(storyPoints)
        const closeButton = document.createElement('button');
        closeButton.classList.add('close-button')
        closeButton.innerHTML = `
        <img src="https://www.nicepng.com/png/full/52-521935_close-white-close-button-png.png">
        `
        priorityCover.appendChild(closeButton)
        modalContent.appendChild(priorityCover)
        
        // Add task details to the modal content, including Story Type and Assigned Participants
        
        const taskName = document.createElement('div')
        taskName.classList.add('view-task-name')
        if (data.type == "Bug"){
            taskName.innerHTML = `
            <img src="https://static-00.iconduck.com/assets.00/bug-icon-2048x2044-xh6kw9rm.png">
            <p>${task.name}</p>
            `
        }
        else {
            taskName.innerHTML = `
            <img src="https://icon-library.com/images/white-icon-png/white-icon-png-18.jpg">
            <p>${task.name}</p>
            `
        }
        modalContent.appendChild(taskName)

        const tagsContainer = document.createElement('div');
        if (data.tags[0] != ""){
            tagsContainer.classList.add('view-task-tag-container');
            tagsContainer.innerHTML += `
            <p>Tags: </p>
            `
            // Check if task has tags and display them
            if (data.tags && data.tags.length > 0) {
                data.tags.forEach((tag) => {
                    const tagElement = document.createElement('div');
                    tagElement.classList.add('view-task-tag');
                    tagElement.textContent = tag;
                    tagsContainer.appendChild(tagElement);
                });
                // const breakElement = document.createElement('br');
                // tagsContainer.appendChild(breakElement);
            }
        }
        modalContent.appendChild(tagsContainer)

        const taskDescription = document.createElement('div')
        taskDescription.classList.add('view-task-description')
        taskDescription.innerHTML = `
        <h2>Description:</h2>
        <p>${data.description}</p>
        `
        modalContent.appendChild(taskDescription)

        const buttons = document.createElement('div')
        buttons.classList.add('view-task-button-container')
        // const editButton = document.createElement('button')
        // editButton.classList.add('edit-task-button')
        // editButton.textContent = "Edit"
        // editButton.addEventListener('click', prompt('hi'))
        // buttons.appendChild(editButton)

        const editButton = document.createElement('button');
        editButton.classList.add('edit-task-button')
        editButton.textContent = 'Edit'

        
        // const editButtons = document.querySelectorAll(".edit-task-button")
        // editButtons.forEach(button => {
        //     button.addEventListener('click', prompt('hi'))
        // })
        
        // editButton.addEventListener('click', editTask(task.index))
        // buttons.appendChild(editButton)
        modalContent.appendChild(editButton)

        // modalContent.innerHTML += `
        //     <h2>Task Details</h2>
        //     <p><strong>Name:</strong> ${task.name}</p>
        //     <p><strong>Story Points:</strong> ${task.points}</p>
        //     <p><strong>Story Type:</strong> ${task.type}</p>
        //     <p><strong>Assigned Participants:</strong> ${task.participants ? task.participants.join(', ') : 'No participants'}</p>
        //     <p><strong>Tags:</strong> ${task.tags ? task.tags.join(', ') : 'No tags'}</p>
        //     <p><strong>Description:</strong> ${task.description}</p>
        // `;
        
        modal.appendChild(modalContent);
        
        // Append the modal to the body
        document.body.appendChild(modal);
        
        // Display the modal by setting its display property to "block"
        modal.style.display = 'block';
        
        // Attach a click event listener to the "Close" button
        const closeButtons = document.querySelectorAll('.close-button');
        closeButtons.forEach(button => {
            button.addEventListener('click', () => {
                pageMask.style.visibility = 'hidden'; // Hide page mask
                modal.style.visibility = 'hidden'; // Hide the modal
            })
        })
        
        // const editButtons = document.querySelectorAll('.edit-task-button');
        // editButtons.forEach(button => {
        //     button.addEventListener('click', () => {
        //         modal.style.visibility = 'hidden'; // Hide the modal
        //         editTask(task.index)
        //     })
        // })

    })
}


// Function to get the priority-specific class
function getPriorityClass(priority) {
    const priorityColors = {
        Low: 'low-task',    // Green
        Medium: 'medium-task', // Yellow
        High: 'high-task',   // Red
    };
    return priorityColors[priority] || 'medium-task'; // Default to medium if priority is not found
}

function getPriorityClass2(priority) {
    const priorityColors = {
        Low: 'view-low-task',    // Green
        Medium: 'view-medium-task', // Yellow
        High: 'view-high-task',   // Red
    };
    return priorityColors[priority] || 'medium-task'; // Default to medium if priority is not found
}










function viewTask(id){
    const db = firebase.firestore()
    task = db.collection('tasks').doc(id)
    task.onSnapshot(doc => {
        const data = doc.data()
        console.log(data)
    })
}

function deleteTask(id){
    const db = firebase.firestore()
    db.collection('tasks').doc(id).delete()
}

function googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
        .then(result => {
            const user = result.user
            document.write(`Hello ${user.displayName}`)
            console.log(user)
        })
        .catch(console.log)
}

// function updatePost(e) {
//     const db = firebase.firestore();
//     const myPost = db.collection('posts').doc('firstpost');
//     myPost.update({ title: e.target.value })
// }