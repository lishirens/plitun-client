#ifndef CONFIGMANAGER_H
#define CONFIGMANAGER_H

#include <QJsonObject>
#include <QObject>
#include "common.h"

class ConfigManager : public QObject
{
    Q_OBJECT
public:
    explicit ConfigManager(QObject *parent = nullptr);

    QJsonObject config{{"lastProfile", ""},
                       {"autoLogin", false},
                       {"minimize", true},
                       {"block", true},
                       {"debug", false},
                       {"local", true},
                       {"no_dtls", false},
                       {"cisco_compat", false}};
    bool loadConfig(SaveFormat saveFormat);
    void saveConfig(SaveFormat saveFormat);
    void saveConfig();
};

#endif // CONFIGMANAGER_H
