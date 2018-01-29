package lin.jonathan.redtooth.service;

import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

import lin.jonathan.redtooth.activity.FoundActivity;

public class DeviceFoundReceiver extends BroadcastReceiver {

    private BluetoothAdapter mBluetoothAdapter = BluetoothAdapter.getDefaultAdapter();
    private int DEVICES_FOUND = 0;
    private boolean KEEP_SCANNING = true;

    public DeviceFoundReceiver() {}

    @Override
    public void onReceive(Context context, Intent intent) {
        String action = intent.getAction();

        if (BluetoothDevice.ACTION_FOUND.equals(action)) {
            BluetoothDevice device = intent.getParcelableExtra(BluetoothDevice.EXTRA_DEVICE);
            if (device.getName() != null) {
                System.out.println("Discovered " + device.getName());
                DEVICES_FOUND++;
                if (device.getName().equals("redtooth50C1A1FACADE")) {
                    System.out.println("Whoa, this is the thing we're looking for!");
                    KEEP_SCANNING = false;
                    mBluetoothAdapter.cancelDiscovery();
                    context.startActivity(new Intent(context, FoundActivity.class));
                } else if (DEVICES_FOUND >= 6) {
                    DEVICES_FOUND = 0;
                    mBluetoothAdapter.cancelDiscovery();
                }
            }
        } else if (BluetoothAdapter.ACTION_DISCOVERY_FINISHED.equals(action)) {
            if (KEEP_SCANNING) startScan();
        }
    }

    protected void startScan() {
        mBluetoothAdapter.startDiscovery();
    }

}
