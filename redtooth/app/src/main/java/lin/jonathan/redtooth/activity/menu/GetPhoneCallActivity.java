package lin.jonathan.redtooth.activity.menu;

import android.content.Intent;
import android.content.SharedPreferences;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;

import lin.jonathan.redtooth.LandingActivity;
import lin.jonathan.redtooth.R;

public class GetPhoneCallActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_get_phone_call);

        SharedPreferences prefs = getSharedPreferences(LandingActivity.PREFS, 0);
        SharedPreferences.Editor editor = prefs.edit();
        editor.putString("ACTION_TYPE", "GET CALL");
        editor.apply();
    }

    public void chatBotButtonClicked(View view) {
        //navigate to get call page
        Intent intent = new Intent(this, ChatBotActivity.class);
        startActivity(intent);
    }

    public void mp3ButtonClicked(View view){
        //navigate to get call page
        Intent intent = new Intent(this, mp3Activity.class);
        startActivity(intent);
    }

    public void backButtonClicked(View view){
        //navigate to get call page
        Intent intent = new Intent(this, LandingActivity.class);
        startActivity(intent);
    }
}
