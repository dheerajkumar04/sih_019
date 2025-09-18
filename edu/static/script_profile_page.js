// User Profile Data
const userProfile = {
    name: 'Dheeraj',
    role: 'student',
    email: 'dheeraj@example.com',
    phone: '9876543210',
    dob: '2005-04-23',
    gender: 'Male',
    joinedDate: '2025-09-08',
    profileImage: 'static/profile_pic.jpeg',
    personalInfo: {
        address: 'Warangal',
        emergencyContact: '+91 9876543211',
        bloodGroup: 'B+',
    },
    academicInfo: {
        class: '10th',
        school: 'Springfield Public School',
        board: 'CBSE',
        subjects: ['Math', 'Science', 'English', 'History', 'Geography'],
        gpa: '8.9',
        year: '2024-2025',
    },
    preferences: {
        language: 'English',
        theme: 'Light',
        notifications: true,
        emailUpdates: false,
    },
    stats: {
        completedLessons: 24,
        totalLessons: 48,
        averageScore: 89,
        studyStreak: 15,
        badgesEarned: 8,
        totalBadges: 12,
    },
    achievements: [
        'Mathematics Excellence',
        'Perfect Attendance',
        'Science Quiz Champion',
        'Early Bird Learner',
        'Consistent Performer',
        'Peer Helper',
        'Creative Thinker',
        'Problem Solver'
    ],
    recentActivity: [
        { activity: 'Completed Mathematics Lesson', time: '2 hours ago', type: 'lesson' },
        { activity: 'Scored 95% in Science Quiz', time: '1 day ago', type: 'quiz' },
        { activity: 'Submitted History Assignment', time: '2 days ago', type: 'assignment' },
        { activity: 'Started English Literature Course', time: '3 days ago', type: 'lesson' },
    ]
};

// State Management
let isEditing = false;

// DOM Elements
const editBtn = document.getElementById('editBtn');
const editText = document.getElementById('editText');
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeProfile();
    setupEventListeners();
    updateProgressBar();
});

// Initialize profile data
function initializeProfile() {
    // Update profile header
    document.getElementById('profileName').textContent = userProfile.name;
    document.getElementById('profileRole').textContent = userProfile.role;
    document.getElementById('profileImage').src = userProfile.profileImage;

    // Update personal information
    document.getElementById('email').textContent = userProfile.email;
    document.getElementById('phone').textContent = userProfile.phone;
    document.getElementById('dob').textContent = userProfile.dob;
    document.getElementById('gender').textContent = userProfile.gender;
    document.getElementById('address').textContent = userProfile.personalInfo.address;
    document.getElementById('emergencyContact').textContent = userProfile.personalInfo.emergencyContact;
    document.getElementById('bloodGroup').textContent = userProfile.personalInfo.bloodGroup;
    document.getElementById('joinedDate').textContent = userProfile.joinedDate;

    // Update academic information
    document.getElementById('class').textContent = userProfile.academicInfo.class;
    document.getElementById('school').textContent = userProfile.academicInfo.school;
    document.getElementById('board').textContent = userProfile.academicInfo.board;
    document.getElementById('academicYear').textContent = userProfile.academicInfo.year;
    document.getElementById('gpa').textContent = userProfile.academicInfo.gpa;

    // Update subjects
    const subjectsContainer = document.getElementById('subjects');
    subjectsContainer.innerHTML = '';
    userProfile.academicInfo.subjects.forEach(subject => {
        const subjectTag = document.createElement('span');
        subjectTag.className = 'subject-tag';
        subjectTag.textContent = subject;
        subjectsContainer.appendChild(subjectTag);
    });

    // Update preferences
    document.getElementById('language').textContent = userProfile.preferences.language;
    document.getElementById('theme').textContent = userProfile.preferences.theme;
    document.getElementById('notifications').textContent = userProfile.preferences.notifications ? 'Enabled' : 'Disabled';
    document.getElementById('emailUpdates').textContent = userProfile.preferences.emailUpdates ? 'Enabled' : 'Disabled';

    // Update stats
    document.getElementById('completedLessons').textContent = `${userProfile.stats.completedLessons}/${userProfile.stats.totalLessons}`;
    document.getElementById('avgScore').textContent = `${userProfile.stats.averageScore}%`;
    document.getElementById('streakDays').textContent = `${userProfile.stats.studyStreak} days`;
    document.getElementById('badges').textContent = `${userProfile.stats.badgesEarned}/${userProfile.stats.totalBadges}`;

    // Update sidebar stats
    document.getElementById('averageScore').textContent = `${userProfile.stats.averageScore}%`;
    document.getElementById('studyStreak').textContent = userProfile.stats.studyStreak;

    // Update achievements
    updateAchievements();

    // Update recent activity
    updateRecentActivity();
}

// Update progress bar
function updateProgressBar() {
    const progressPercentage = Math.round((userProfile.stats.completedLessons / userProfile.stats.totalLessons) * 100);
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    
    progressFill.style.width = `${progressPercentage}%`;
    progressText.textContent = `${progressPercentage}%`;
}

// Update achievements display
function updateAchievements() {
    const achievementsGrid = document.getElementById('achievementsGrid');
    achievementsGrid.innerHTML = '';
    
    userProfile.achievements.forEach(achievement => {
        const achievementItem = document.createElement('div');
        achievementItem.className = 'achievement-item';
        achievementItem.innerHTML = `
            <div class="achievement-icon">
                <i class="fas fa-star"></i>
            </div>
            <span class="achievement-text">${achievement}</span>
        `;
        achievementsGrid.appendChild(achievementItem);
    });
}

// Update recent activity display
function updateRecentActivity() {
    const activityList = document.getElementById('activityList');
    activityList.innerHTML = '';
    
    userProfile.recentActivity.forEach(activity => {
        const activityItem = document.createElement('div');
        activityItem.className = 'activity-item';
        
        let iconClass = 'fas fa-book-open';
        let iconType = 'lesson';
        
        if (activity.type === 'quiz') {
            iconClass = 'fas fa-question-circle';
            iconType = 'quiz';
        } else if (activity.type === 'assignment') {
            iconClass = 'fas fa-file-alt';
            iconType = 'assignment';
        }
        
        activityItem.innerHTML = `
            <div class="activity-icon ${iconType}">
                <i class="${iconClass}"></i>
            </div>
            <div class="activity-content">
                <p class="activity-text">${activity.activity}</p>
                <span class="activity-time">${activity.time}</span>
            </div>
        `;
        activityList.appendChild(activityItem);
    });
}

// Setup event listeners
function setupEventListeners() {
    // Edit button functionality
    editBtn.addEventListener('click', toggleEditMode);

    // Tab navigation
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabName = button.getAttribute('data-tab');
            switchTab(tabName);
        });
    });

    // Add smooth scrolling for better UX
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Toggle edit mode
function toggleEditMode() {
    isEditing = !isEditing;
    
    if (isEditing) {
        editText.textContent = 'Save Changes';
        editBtn.style.background = 'rgba(34, 197, 94, 0.2)';
        enableEditMode();
    } else {
        editText.textContent = 'Edit Profile';
        editBtn.style.background = 'rgba(255, 255, 255, 0.2)';
        disableEditMode();
        saveChanges();
    }
}

// Enable edit mode
function enableEditMode() {
    // Convert text elements to input fields
    const editableFields = [
        'email', 'phone', 'address', 'emergencyContact', 'bloodGroup',
        'class', 'school', 'board', 'gpa', 'language', 'theme'
    ];
    
    editableFields.forEach(fieldId => {
        const element = document.getElementById(fieldId);
        if (element) {
            const currentValue = element.textContent;
            const input = document.createElement('input');
            input.type = 'text';
            input.value = currentValue;
            input.className = 'edit-input';
            input.style.cssText = `
                border: 1px solid #3b82f6;
                border-radius: 4px;
                padding: 4px 8px;
                font-size: 0.875rem;
                width: 100%;
                max-width: 200px;
            `;
            element.parentNode.replaceChild(input, element);
            input.id = fieldId;
        }
    });

    // Add visual feedback
    document.querySelectorAll('.edit-input').forEach(input => {
        input.addEventListener('focus', function() {
            this.style.boxShadow = '0 0 0 2px rgba(59, 130, 246, 0.2)';
        });
        
        input.addEventListener('blur', function() {
            this.style.boxShadow = 'none';
        });
    });
}

// Disable edit mode
function disableEditMode() {
    const editInputs = document.querySelectorAll('.edit-input');
    
    editInputs.forEach(input => {
        const span = document.createElement('span');
        span.textContent = input.value;
        span.className = 'info-value';
        span.id = input.id;
        input.parentNode.replaceChild(span, input);
    });
}

// Save changes
function saveChanges() {
    // In a real application, this would send data to a server
    console.log('Profile changes saved!');
    
    // Show success message
    showNotification('Profile updated successfully!', 'success');
}

// Switch between tabs
function switchTab(tabName) {
    // Remove active class from all tabs and contents
    tabButtons.forEach(btn => btn.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));
    
    // Add active class to selected tab and content
    const selectedTab = document.querySelector(`[data-tab="${tabName}"]`);
    const selectedContent = document.getElementById(tabName);
    
    if (selectedTab && selectedContent) {
        selectedTab.classList.add('active');
        selectedContent.classList.add('active');
    }
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        z-index: 1000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add some interactive features
function addInteractiveFeatures() {
    // Add hover effects to stat cards
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px)';
            this.style.boxShadow = '0 8px 25px -8px rgba(0, 0, 0, 0.2)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1)';
        });
    });

    // Add click animation to achievement items
    const achievementItems = document.querySelectorAll('.achievement-item');
    achievementItems.forEach(item => {
        item.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });
}

// Initialize interactive features after DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(addInteractiveFeatures, 500);
});

// Add keyboard navigation support
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && isEditing) {
        toggleEditMode();
    }
    
    // Tab navigation with arrow keys
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        const activeTab = document.querySelector('.tab-btn.active');
        const allTabs = Array.from(tabButtons);
        const currentIndex = allTabs.indexOf(activeTab);
        
        let newIndex;
        if (e.key === 'ArrowLeft') {
            newIndex = currentIndex > 0 ? currentIndex - 1 : allTabs.length - 1;
        } else {
            newIndex = currentIndex < allTabs.length - 1 ? currentIndex + 1 : 0;
        }
        
        const newTab = allTabs[newIndex];
        const tabName = newTab.getAttribute('data-tab');
        switchTab(tabName);
    }
});

// Add loading animation
function showLoadingAnimation() {
    const loader = document.createElement('div');
    loader.id = 'loader';
    loader.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(255, 255, 255, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
    `;
    
    loader.innerHTML = `
        <div style="
            width: 40px;
            height: 40px;
            border: 4px solid #e5e7eb;
            border-top: 4px solid #3b82f6;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        "></div>
    `;
    
    // Add CSS animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(loader);
    
    // Remove loader after 1 second
    setTimeout(() => {
        document.body.removeChild(loader);
    }, 1000);
}

// Show loading animation on page load
window.addEventListener('load', showLoadingAnimation);