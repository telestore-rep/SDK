# Telestore SDK

SDK to link your application with tele.store

### Supported languages

- [JavaScript/TypeScript](./JavaScript/README.md)

Other languages will be added later

# How to Get User Key?

To get user key you need to first create an account with the bot.

Go to [bot](https://t.me/@TeleStoreChatBot) and press START:

![bot start](https://github.com/telestore-rep/SDK/blob/main/resources/images/bot_start.webp?raw=true)

Then you will need to share your contact, since only the fully verified users can get user keys.

![bot start](https://github.com/telestore-rep/SDK/blob/main/resources/images/bot_after_start.webp?raw=true)

After that you will need to link your email:

![bot start](https://github.com/telestore-rep/SDK/blob/main/resources/images/bot_link_mail.webp?raw=true)

You will get an email with the code that you need to copy and paste directly in the bot:

![bot start](https://github.com/telestore-rep/SDK/blob/main/resources/images/email_code_confirm.webp?raw=true)

After that you can check in the Tele Store mini-app on Profile page if the system has your correct data:

![bot start](https://github.com/telestore-rep/SDK/blob/main/resources/images/bot_profile.webp?raw=true)

Open a browser and go to the [web-version](https://dev.tele.store:8081) and press the `Forgot?` link:

![bot start](https://github.com/telestore-rep/SDK/blob/main/resources/images/forgot.webp?raw=true)

Enter a strong password, the phone number that you've shared with the bot and get the email code along with the OTP code that the bot will send you. 

Now you can log in using your phone number and password:

![bot start](https://github.com/telestore-rep/SDK/blob/main/resources/images/login.webp?raw=true)

Go to a security page via the link at the bottom of a `Profile` page:

![bot start](https://github.com/telestore-rep/SDK/blob/main/resources/images/profile_security.webp?raw=true)

Choose `User Keys` option:

![bot start](https://github.com/telestore-rep/SDK/blob/main/resources/images/security_page.webp?raw=true)

Then press `Send OTP code` to start the process of user key generation:

![bot start](https://github.com/telestore-rep/SDK/blob/main/resources/images/user_key_gen.webp?raw=true)

After entering the OTP you will see the user key. 

!WARNING!
User key is generated on the client's side and is never stored on our side and it will be displayed only once. Make sure, you copy the key and store it safely — whoever possesses the key can control your account.

![bot start](https://github.com/telestore-rep/SDK/blob/main/resources/images/user_key.webp?raw=true)

Now you can use the key to login or for the authentication via SDK.

# How to Get a Developer Status?

_(it advised to use desktop for the following, since the Developer Panel is better suited for big screens)_

Log in into the web-version (you can use the user key).

Click the key pictogram to enter the user key mode:

![bot start](https://github.com/telestore-rep/SDK/blob/main/resources/images/ts_login.webp?raw=true)

Enter the previously generated user key:

![bot start](https://github.com/telestore-rep/SDK/blob/main/resources/images/ts_login_uk.webp?raw=true)

Got to the `Profile` page and press `Join as Developer` link:

![bot start](https://github.com/telestore-rep/SDK/blob/main/resources/images/profile_join.webp?raw=true)

Enter the data about your company and yourself:

![bot start](https://github.com/telestore-rep/SDK/blob/main/resources/images/dev_data.webp?raw=true)

After that you will need to go to `Developer Panel`.

You can find the link to `Developer Panel` in the bottom of the `Profile` page:

![bot start](https://github.com/telestore-rep/SDK/blob/main/resources/images/ts_dev_panel_link.webp?raw=true)

You can add new app with the `Add new game` button:

![bot start](https://github.com/telestore-rep/SDK/blob/main/resources/images/ts_dev_panel.webp?raw=true)

Enter the necessary data and save the changes:

![bot start](https://github.com/telestore-rep/SDK/blob/main/resources/images/ts_game_edit.webp?raw=true)

When saved, the game will be on moderation:
![bot start](https://github.com/telestore-rep/SDK/blob/main/resources/images/ts_game_edit_success.webp?raw=true)

After moderation, the app will be available in the TeleStore catalogue.