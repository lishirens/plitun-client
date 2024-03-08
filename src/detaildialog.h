#ifndef DETAILDIALOG_H
#define DETAILDIALOG_H

#include <QDialog>
#include <QJsonArray>
#include <QTimer>

namespace Ui {
class DetailDialog;
}

class plinfo;
class DetailDialog : public QDialog
{
    Q_OBJECT

public:
    explicit DetailDialog(plinfo *parent);
    ~DetailDialog();

    void setRoutes(const QJsonArray &excludes, const QJsonArray &includes);
    void clear();
private:
    Ui::DetailDialog *ui;
    QTimer timer;
    plinfo *plinfo;

    QString format(double bytes);  // typedef quint64 qulonglong;
    // QWidget interface
protected:
    void showEvent(QShowEvent *event) override;
    void closeEvent(QCloseEvent *event) override;
};

#endif // DETAILDIALOG_H
