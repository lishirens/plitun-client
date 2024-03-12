function Component()
{
    component.setUpdateAvailable(false);

    if (systemInfo.kernelType === "darwin") {
        installer.setValue("TargetDir", installer.value("HomeDir") + "/");
    }
    // end with "/" in config.xml
    var targetDir = installer.value("TargetDir");
    var uninstaller = installer.value("MaintenanceToolName");

    if (systemInfo.kernelType === "linux") {
        installer.setValue("TargetDir", targetDir + "plitun");

        uninstaller = installer.value("TargetDir") + "/" + uninstaller;

    } else if (systemInfo.kernelType === "winnt") {
        installer.setValue("TargetDir", targetDir + "Plitun");

        uninstaller = installer.value("TargetDir") + "/" + uninstaller + ".exe";
    } else if (systemInfo.kernelType === "darwin") {
        installer.setValue("TargetDir", targetDir + "Plitun");

        uninstaller = installer.value("TargetDir") + "/" + uninstaller + ".app/Contents/MacOS/uninstall";
    }

    if (installer.isInstaller()) {
        if (installer.fileExists(uninstaller)) {
            installer.execute(uninstaller);
        }
//         console.log("plitun running status: " + installer.isProcessRunning("plitun"))
//         console.log("vpnui running status: " + installer.isProcessRunning("vpnui"))

        // request when component really installing
        component.addStopProcessForUpdateRequest("vpnui");
    }

    if (systemInfo.kernelType === "darwin") {
        component.addStopProcessForUpdateRequest("Plitun");
    } else {
        // kill self when install and uninstall
        component.addStopProcessForUpdateRequest("plitun");
    }
}

Component.prototype.createOperations = function()
{
    if (systemInfo.kernelType === "linux") {
        installer.gainAdminRights()

        // default call createOperationsForArchive and then createOperationsForPath
        // The default implementation is recursively creating Copy and Mkdir operations for all files and folders within path.
        component.createOperations();

        // will be auto removed on uninstall
        component.addOperation("Copy", "@TargetDir@/plitun.desktop", "/usr/share/applications/plitun.desktop");

        // install and start the service or stop and remove the service
        component.addElevatedOperation("Execute", "@TargetDir@/bin/vpnagent","install",
                                "UNDOEXECUTE","@TargetDir@/bin/vpnagent","uninstall");
    } else if (systemInfo.kernelType === "winnt") {
        installer.gainAdminRights()

        component.createOperations();

        // https://forum.qt.io/topic/87431/how-could-we-detect-users-vcredist-installed-when-using-qt-installer-framework/4
        // https://doc.qt.io/qtinstallerframework/scripting-systeminfo.html#buildCpuArchitecture-prop
        if (systemInfo.buildCpuArchitecture === "x86_64") {
            component.addElevatedOperation("Execute", "{0,3010,1638,5100}", "@TargetDir@/vc_redist.x64.exe", "/norestart", "/q");
        } else {
            component.addElevatedOperation("Execute", "{0,3010,1638,5100}", "@TargetDir@/vc_redist.arm64.exe", "/norestart", "/q"); 
        }

        //开始菜单快捷方式
        component.addOperation("CreateShortcut",
                               "@TargetDir@/plitun.exe",
                               "@StartMenuDir@/Plitun SSL VPN.lnk",
                               "workingDirectory=@TargetDir@");

        //桌面快捷方式
        component.addOperation("CreateShortcut",
                               "@TargetDir@/plitun.exe",
                               "@DesktopDir@/Plitun SSL VPN.lnk",
                               "workingDirectory=@TargetDir@");


        component.addElevatedOperation("Execute", "@TargetDir@/vpnagent.exe","install",
                                "UNDOEXECUTE","@TargetDir@/vpnagent.exe","uninstall");
    } else if (systemInfo.kernelType === "darwin") {
        component.createOperations();
        component.addOperation("CreateLink", "@ApplicationsDir@/Plitun.app", "@TargetDir@/Plitun.app");

        if (installer.gainAdminRights()) {
            // install and start the service or stop and remove the service
            component.addElevatedOperation("Execute", "@TargetDir@/Plitun.app/Contents/MacOS/vpnagent","install",
                                    "UNDOEXECUTE","@TargetDir@/Plitun.app/Contents/MacOS/vpnagent","uninstall");
            installer.dropAdminRights()
        }
    }
}

