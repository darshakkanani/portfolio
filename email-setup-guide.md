# Email Setup Guide for Contact Form

## Option 1: EmailJS (Recommended - Free)

1. **Sign up at [EmailJS](https://www.emailjs.com/)**
2. **Create a new service:**
   - Go to Email Services
   - Add Gmail service
   - Connect your Gmail account (darshakkanani444@gmail.com)

3. **Create an email template:**
   - Go to Email Templates
   - Create new template with these variables:
   ```
   Subject: {{subject}}
   
   New message from {{from_name}}
   Email: {{from_email}}
   
   Message:
   {{message}}
   ```

4. **Get your credentials:**
   - Service ID: Copy from your service
   - Template ID: Copy from your template
   - User ID: Copy from Account > API Keys

5. **Update the JavaScript:**
   Replace in `/js/main.js`:
   ```javascript
   service_id: 'your_service_id', // Replace with your EmailJS service ID
   template_id: 'your_template_id', // Replace with your EmailJS template ID
   user_id: 'your_user_id', // Replace with your EmailJS user ID
   ```

## Option 2: Netlify Forms (If hosting on Netlify)

1. Add `netlify` attribute to your form in `index.html`:
   ```html
   <form id="contact-form" class="contact-form enhanced-form" netlify>
   ```

2. Add a hidden input:
   ```html
   <input type="hidden" name="form-name" value="contact" />
   ```

## Option 3: Formspree (Alternative)

1. Sign up at [Formspree](https://formspree.io/)
2. Create a new form
3. Update form action:
   ```html
   <form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
   ```

## Current Setup

The contact form currently:
- ✅ Has client-side validation
- ✅ Falls back to mailto: if email service fails
- ✅ Shows proper status messages
- ✅ Is fully responsive

Choose one of the above options to enable actual email sending!
