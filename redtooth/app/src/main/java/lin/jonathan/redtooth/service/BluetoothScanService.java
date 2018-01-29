package lin.jonathan.redtooth.service;

import android.app.IntentService;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.content.BroadcastReceiver;
import android.content.Intent;
import android.content.Context;
import android.content.IntentFilter;

import lin.jonathan.redtooth.activity.FoundActivity;

/**
 * An {@link IntentService} subclass for handling asynchronous task requests in
 * a service on a separate handler thread.
 * <p>
 * TODO: Customize class - update intent actions, extra parameters and static
 * helper methods.
 */
public class BluetoothScanService extends IntentService {

    public BluetoothScanService() {
        super("BluetoothScanService");
    }

    @Override
    protected void onHandleIntent(Intent intent) {
        startScan();
    }

    public void startScan() {
        System.out.println("Starting scan process.");
        BluetoothAdapter.getDefaultAdapter().startDiscovery();
    }

}
