package lin.jonathan.redtooth;

import android.media.MediaPlayer;
import android.media.Ringtone;
import android.media.RingtoneManager;
import android.net.Uri;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;

public class PlayActivity extends AppCompatActivity {

    private Button accept;
    private MediaPlayer player;
    private Ringtone r;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_call);

        accept = (Button) findViewById(R.id.accept);

        accept.setOnClickListener(new View.OnClickListener() {

            @Override
            public void onClick(View v) {
                if (!player.isPlaying()) player.start();
            }

        });

        Uri notification = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_RINGTONE);
        r = RingtoneManager.getRingtone(getApplicationContext(), notification);

        player = MediaPlayer.create(this, R.raw.carl);
        player.setLooping(true);
    }

    @Override
    protected void onResume() {
        super.onResume();
        if (!r.isPlaying() && !player.isPlaying()) r.play();
    }
}
