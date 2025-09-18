
const buttons = document.querySelectorAll('.options button');
const contentSections = document.querySelectorAll('.dashboard, .lessons, .quizzes, .achievements, .bookmarks');

buttons.forEach(button => {
    button.addEventListener('click', () => {
        const targetClass = button.getAttribute('data-target');

        // Hide all content sections
        contentSections.forEach(section => {
            section.style.display = 'none';
        });

        // Remove active class from all buttons
        buttons.forEach(btn => btn.classList.remove('active'));

        // Show the targeted section
        const targetSection = document.querySelector(`.${targetClass}`);
        if (targetSection) {
            targetSection.style.display = 'block';
        }

        // Set the clicked button as active
        button.classList.add('active');
    });
});

const dashboardButton = document.querySelector('button[data-target="dashboard"]');
dashboardButton.focus();

async function changeLanguage(card, lang) {
      const encodedText = encodeURIComponent(card);

      if (lang=='en'){
        return card;
      }

      let email = 'chat241289@gmail.com';

      const apiUrl = `https://api.mymemory.translated.net/get?q=${encodedText}&langpair=${'en'}|${lang}&de=${email}`;

      try {
        const res = await fetch(apiUrl);
        const data = await res.json();

        let translatedText = data.responseData.translatedText;

        // Return modified card
        return translatedText;
      } catch (error) {
        console.error("Translation error:", error);
        return card; // Fallback to original
      }
    }

const lang = document.getElementById('language').dataset.lang;
const page_details = document.getElementById("page_deatils");
const options = document.getElementById('options');

// updating left side with language
async function CL(div_){
    for(let child of div_.children){
        child.textContent = await changeLanguage(child.textContent, lang);
    }
}

async function ChangeAllElements(element) {
  for (const node of element.childNodes) {
    if (node.nodeType === Node.TEXT_NODE) {
      const trimmed = node.textContent.trim();
      if (trimmed.length > 0) {
        node.textContent = await changeLanguage(node.textContent, lang);
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      await ChangeAllElements(node);  // recurse for child elements
    }
  }
}



ChangeAllElements(document.getElementById('static_left'));
ChangeAllElements(document.getElementById('dynamic_right'));

const profile_element1 = document.getElementById('profile');
profile_element1.style.cursor = 'pointer';  // Optional: ensures cursor shows as clickable
profile_element1.onclick = function() {
    window.location.href = '/profile_page';
};

const profile_element2 = document.getElementById('profile1');
profile_element2.style.cursor = 'pointer';  // Optional: ensures cursor shows as clickable
profile_element2.onclick = function() {
    window.location.href = '/profile_page';
};

const computer_lsn_load = document.getElementById('computer_lsns');
computer_lsn_load.style.cursor = 'pointer';
computer_lsn_load.onclick = function() {
    window.location.href = '/lsn';
};

const lac = document.getElementById('lesson_access_card');
lac.onclick = function() {
    let btn1 = document.querySelector('button[data-target="lessons"]');
    btn1.click();
}

const qac = document.getElementById('quiz_access_card');
qac.onclick = function() {
    let btn2 = document.querySelector('button[data-target="quizzes"]');
    btn2.click();
}

const aac = document.getElementById('achievement_access_card');
aac.onclick = function() {
    let btn3 = document.querySelector('button[data-target="achievements"]');
    btn3.click();
}

const bac = document.getElementById('bookmark_access_card');
bac.onclick = function() {
    let btn4 = document.querySelector('button[data-target="bookmarks"]');
    btn4.click();
}

function redirect_to_lsn(){
    window.location.href = '/lsn';
}