package lin.jonathan.redtooth;

import android.Manifest;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.support.v4.app.ActivityCompat;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.view.Window;
import android.widget.TextView;

import lin.jonathan.redtooth.activity.CallActivity;
import lin.jonathan.redtooth.activity.menu.GetPhoneCallActivity;
import lin.jonathan.redtooth.activity.menu.GetTextActivity;
import lin.jonathan.redtooth.activity.menu.SendPhoneCallActivity;
import lin.jonathan.redtooth.activity.menu.SendTextActivity;
import lin.jonathan.redtooth.service.BluetoothScanService;

public class LandingActivity extends AppCompatActivity {

    public static final String PREFS = "REDTOOTH";

    private BluetoothAdapter mBluetoothAdapter = BluetoothAdapter.getDefaultAdapter();
    private int DEVICES_FOUND = 0;
    private boolean KEEP_SCANNING = true;

    private TextView settings;

    private String action;
    private String callType;

    private BroadcastReceiver mReceiver = new BroadcastReceiver() {

        @Override
        public void onReceive(Context context, Intent intent) {
            String intentAction = intent.getAction();

            if (BluetoothDevice.ACTION_FOUND.equals(intentAction)) {
                BluetoothDevice device = intent.getParcelableExtra(BluetoothDevice.EXTRA_DEVICE);
                System.out.println(device.getAddress());
                if (device.getName() != null || device.getAddress().equals("98:D3:31:FB:5F:8E")) {
                    System.out.println("Discovered " + device.getName());
                    DEVICES_FOUND++;
                    System.out.println(DEVICES_FOUND);
                    if (device.getName().equals("redtooth50C1A1FACADE") || device.getAddress().equals("98:D3:31:FB:5F:8E")) {
                        System.out.println("Whoa, this is the thing we're looking for!");
                        KEEP_SCANNING = false;
                        mBluetoothAdapter.cancelDiscovery();

                        if (action.equals("GET CALL")) {
                            System.out.println("Getting a call...");
                            if (callType.equals("BOT")) {
                                System.out.println("...from Carl.");
                                context.startActivity(new Intent(context, CallActivity.class));
                            } else if (callType.equals("MP3")) {
                                System.out.println("...from a MP3.");
                                context.startActivity(new Intent(context, PlayActivity.class));
                            }
                        } else if (action.equals("SEND CALL")) {
                            System.out.println("Trying to send call.");

                            Intent callIntent = new Intent(Intent.ACTION_CALL);
                            callIntent.setData(Uri.parse("tel:3017856593"));
                            try {
                                startActivity(callIntent);
                            } catch (Exception e) {
                                e.printStackTrace();
                            }
                        }
                    } else if (DEVICES_FOUND >= 6) {
                        DEVICES_FOUND = 0;
                        mBluetoothAdapter.cancelDiscovery();
                        if (KEEP_SCANNING) startScanService();
                    }
                }
            } else if (BluetoothAdapter.ACTION_DISCOVERY_FINISHED.equals(action)) {
                if (KEEP_SCANNING) startScanService();
            }
        }

    };

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        this.requestWindowFeature(Window.FEATURE_NO_TITLE);
        setContentView(R.layout.activity_home_screen);

        settings = (TextView) findViewById(R.id.settings);

        String settingsText = "Settings:\n";

        SharedPreferences prefs = getSharedPreferences(PREFS, 0);

        action = prefs.getString("ACTION_TYPE", "GET CALL");
        callType = prefs.getString("CALLTYPE", "BOT");

        settingsText += "Action Type: " + action + "\n";
        settingsText += "Call Type: " + callType + "\n";
        settingsText += "Target Number: 3017856593\n";

        settings.setText(settingsText);

        int MY_PERMISSIONS_REQUEST_ACCESS_COARSE_LOCATION = 1;
        ActivityCompat.requestPermissions(this,
                new String[]{Manifest.permission.ACCESS_COARSE_LOCATION},
                MY_PERMISSIONS_REQUEST_ACCESS_COARSE_LOCATION);

        requestCallPerms();

        IntentFilter filter = new IntentFilter();

        filter.addAction(BluetoothAdapter.ACTION_DISCOVERY_FINISHED);
        filter.addAction(BluetoothAdapter.ACTION_DISCOVERY_STARTED);
        filter.addAction(BluetoothDevice.ACTION_FOUND);

        registerReceiver(mReceiver, filter);
    }

    @Override
    protected void onStart() {
        super.onStart();

        System.out.println("Here we go!");

        BluetoothAdapter mBluetoothAdapter = BluetoothAdapter.getDefaultAdapter();
        if (mBluetoothAdapter != null && !mBluetoothAdapter.isEnabled()) {
            Intent enableBtIntent = new Intent(BluetoothAdapter.ACTION_REQUEST_ENABLE);
            startActivityForResult(enableBtIntent, 1);
        } else startScanService();
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        if (requestCode == 1 && resultCode == RESULT_OK)
            startScanService();
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        unregisterReceiver(mReceiver);
    }

    public void talkCarl(View view) {
        Intent intent = new Intent(this, CallActivity.class);
        startActivity(intent);
    }

    public void requestCallPerms() {
        ActivityCompat.requestPermissions(this,
            new String[]{Manifest.permission.CALL_PHONE},
            2364);
    }

    public void getCallButtonClicked(View view) {
        Intent intent = new Intent(this, GetPhoneCallActivity.class);
        startActivity(intent);
    }

    public void sendCallButtonClicked(View view) {
        Intent intent = new Intent(this, SendPhoneCallActivity.class);
        startActivity(intent);
    }

    public void getTextButtonClicked(View view) {
        Intent intent = new Intent(this, GetTextActivity.class);
        startActivity(intent);
    }

    public void sendTextButtonClicked(View view) {
        Intent intent = new Intent(this, SendTextActivity.class);
        startActivity(intent);
    }

    protected void startScanService() {
//        IntentFilter filter = new IntentFilter();
//
//        filter.addAction(BluetoothDevice.ACTION_FOUND);
//        filter.addAction(BluetoothAdapter.ACTION_DISCOVERY_STARTED);
//        filter.addAction(BluetoothAdapter.ACTION_DISCOVERY_FINISHED);
//
//        registerReceiver(mReceiver, filter);

        // Start the actual service for discovery process.
        System.out.println("Start SERVICE called.");
        Intent intent = new Intent(this, BluetoothScanService.class);
        startService(intent);
    }

}
