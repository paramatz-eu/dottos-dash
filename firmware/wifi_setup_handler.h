#pragma once

#include "esphome/components/web_server_base/web_server_base.h"
#include "esphome/components/wifi/wifi_component.h"
#include "esphome/core/component.h"

#include <string>
namespace esphome {
namespace dottos_dash {

// A deliberately small private endpoint for the adult Wi-Fi form. Do not use a
// template text entity for the password: Web Server state APIs expose a text
// entity's raw value even when its display mode is "password".
class WifiSetupHandler final : public web_server_idf::AsyncWebHandler, public Component {
 public:
  bool canHandle(web_server_idf::AsyncWebServerRequest *request) const override {
    if (request->method() != HTTP_POST)
      return false;
    char url_buffer[web_server_idf::AsyncWebServerRequest::URL_BUF_SIZE];
    return request->url_to(url_buffer) == "/wifi-setup";
  }

  void handleRequest(web_server_idf::AsyncWebServerRequest *request) override {
    std::string ssid = request->arg("ssid");
    std::string password = request->arg("password");
    if (ssid.empty() || ssid.size() > 32 || password.size() > 63) {
      request->send(400, "text/plain", "Invalid Wi-Fi credentials");
      return;
    }

    // Web callbacks do not run in ESPHome's main loop. Defer the Wi-Fi state
    // change so it has the same execution safety as ESPHome REST actions.
    this->defer([this, ssid, password]() {
      wifi::global_wifi_component->disable();
      wifi::global_wifi_component->save_wifi_sta(ssid, password);
      wifi::global_wifi_component->enable();
    });
    request->send(202, "text/plain", "Connecting");
  }
};

}  // namespace dottos_dash
}  // namespace esphome
