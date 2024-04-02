pub fn find_valid_locale(locale: &String) -> String {
    if locale.eq(&String::from("en")) {
        return "en-US".to_string();
    }

    return locale.clone()
}