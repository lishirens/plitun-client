#ifndef plinfo_H
#define plinfo_H

#include <QWidget>
#include <QIcon>
#include <QJsonObject>
#include <QTimer>

QT_BEGIN_NAMESPACE
namespace Ui {
class plinfo;
}
QT_END_NAMESPACE

class JsonRpcWebSocketClient;
class ProfileManager;
class DetailDialog;
class QSystemTrayIcon;
class QMenu;
class QComboBox;

class plinfo : public QWidget
{
    Q_OBJECT

public:
    enum { STATUS, CONFIG, CONNECT, DISCONNECT, RECONNECT, INTERFACE, ABORT, STAT };

    plinfo(QWidget *parent = nullptr);
    ~plinfo();

    JsonRpcWebSocketClient *rpc = nullptr;

signals:
    void vpnConnected();
    void vpnClosed();
    void callEnd();


    // QWidget interface
protected:
    void closeEvent(QCloseEvent *event) override;
    void showEvent(QShowEvent *event) override;

private:
    Ui::plinfo *ui;
    QSystemTrayIcon *trayIcon = nullptr;
    QMenu *trayIconMenu;
    QComboBox *iconComboBox;
    QAction *actionConnect, *actionDisconnect, *actionQuit, *actionConfig;
    QTimer timer;

    QIcon iconConnected = QIcon(":/assets/connected.png");
    QIcon iconNotConnected = QIcon(":/assets/notconnected.png");
    QIcon iconConnecting = QIcon(":/assets/connecting.png");

    ProfileManager *profileManager;
    bool m_vpnConnected;
    bool activeDisconnect = false;
    DetailDialog *detailDialog = nullptr;
    QJsonObject currentProfile = {};

    void center();
    void loadStyleSheet(const QString &styleSheetFile);

    void createTrayActions();
    void createTrayIcon();
    void initConfig();
    void afterShowOneTime();

    void resetVPNStatus();

private slots:
    void configVPN();
    void connectVPN(bool reconnect = false);
    void disconnectVPN();
    void getVPNStatus();

    //  QMetaObject::connectSlotsByName
    void on_buttonConnect_clicked();
    void on_buttonProfile_clicked();
    void on_buttonViewLog_clicked();
    void on_buttonDetails_clicked();
    void on_buttonSecurityTips_clicked();
};
#endif // plinfo_H
